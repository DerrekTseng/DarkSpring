package net.derrek.spring.scheduler;

import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import javax.annotation.PostConstruct;

import org.quartz.CronScheduleBuilder;
import org.quartz.JobBuilder;
import org.quartz.JobDataMap;
import org.quartz.JobDetail;
import org.quartz.JobKey;
import org.quartz.Scheduler;
import org.quartz.SchedulerException;
import org.quartz.Trigger;
import org.quartz.TriggerBuilder;
import org.quartz.TriggerKey;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.aop.support.AopUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationContext;
import org.springframework.stereotype.Component;

import net.derrek.spring.listener.SpringApplicationListener;

@Component
public class ScheduledManager implements AutoCloseable {

	protected static final Logger logger = LoggerFactory.getLogger(ScheduledManager.class);

	private static final String SCHEDULER_GROUP_NAME = "scheduled";

	@Autowired
	Scheduler scheduler;

	@Autowired
	ApplicationContext applicationContext;

	@Autowired
	SpringApplicationListener springApplicationListener;

	private static final ConcurrentHashMap<String, ScheduleVo> scheduleVoMap = new ConcurrentHashMap<>();

	@PostConstruct
	private synchronized void init() throws SchedulerException {

		if (springApplicationListener.isApplicationInitialized()) {

			// 掃描 @Scheduled 及 extends ScheduledJob 的 class

			applicationContext.getBeansWithAnnotation(Scheduled.class).values().stream().filter(bean -> {
				return ScheduledJob.class.isAssignableFrom(bean.getClass());
			}).forEach(bean -> {
				try {
					@SuppressWarnings("unchecked")
					Class<ScheduledJob> clazz = (Class<ScheduledJob>) AopUtils.getTargetClass(bean);
					Scheduled scheduledAnnotation = clazz.getDeclaredAnnotation(Scheduled.class);
					String id = scheduledAnnotation.jobId();
					String scheduled = scheduledAnnotation.scheduled();
					boolean enabled = scheduledAnnotation.enabled();
					addJob(id, scheduled, clazz, enabled);
				} catch (SchedulerException e) {
					throw new RuntimeException(e);
				}
			});

		}
	}

	/**
	 * 取得已加入的 job id
	 * 
	 * @return
	 */
	public String[] getJobs() {
		return scheduleVoMap.keySet().stream().toArray(String[]::new);
	}

	/**
	 * job 是否在執行
	 * 
	 * @param jobId
	 * @return
	 */
	public boolean isRunning(String jobId) {
		ScheduleVo scheduleVo = getScheduleVo(jobId);
		return scheduleVo.isRunning;
	}

	/**
	 * 設定 job 是否執行
	 * 
	 * @param jobId
	 * @param isRunning
	 */
	void setRunning(String jobId, boolean isRunning) {
		ScheduleVo scheduleVo = getScheduleVo(jobId);
		scheduleVo.isRunning = isRunning;
	}

	/**
	 * 設定 job 是否啟用
	 * 
	 * @param jobId
	 * @param enabled
	 * @throws SchedulerException
	 */
	public void setEnabled(String jobId, boolean enabled) throws SchedulerException {
		ScheduleVo scheduleVo = getScheduleVo(jobId);
		if (scheduleVo.enabled != enabled) {
			scheduleVo.enabled = enabled;
			if (enabled) {
				scheduleJob(scheduleVo);
			} else {
				JobKey jobKey = new JobKey(jobId, SCHEDULER_GROUP_NAME);
				scheduler.deleteJob(jobKey);
			}
		}
	}

	/**
	 * job 是否啟用
	 * 
	 * @param jobId
	 * @return
	 */
	public boolean isEnabled(String jobId) {
		ScheduleVo scheduleVo = getScheduleVo(jobId);
		return scheduleVo.enabled;
	}

	/**
	 * 執行 job
	 * 
	 * @param jobId
	 * @throws SchedulerException
	 */
	public void fireJob(String jobId) throws SchedulerException {
		ScheduleVo scheduleVo = getScheduleVo(jobId);
		if (scheduleVo.isRunning) {
			throw new SchedulerException(String.format("job [%s] is running currently.", jobId));
		} else if (scheduleVo.enabled) {
			JobKey jobKey = new JobKey(jobId, SCHEDULER_GROUP_NAME);
			scheduler.triggerJob(jobKey);
		} else {
			new Thread(() -> {
				ScheduledJob scheduledJob = newScheduledJobInstance(scheduleVo.jobClass);
				Map<String, Object> dataMap = new HashMap<>();
				dataMap.put("jobId", jobId);
				ScheduledExecutionContext scheduledExecutionContext = new ScheduledExecutionContext(dataMap);
				scheduledJob.fire(scheduledExecutionContext);
			}).start();
		}
	}

	private ScheduledJob newScheduledJobInstance(Class<? extends ScheduledJob> clazz) {
		try {
			return clazz.getConstructor().newInstance();
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 取得 job 下次執行時間，null 表示未啟用
	 * 
	 * @param jobId
	 * @return
	 * @throws SchedulerException
	 */
	public Date getNextFireTime(String jobId) throws SchedulerException {
		ScheduleVo scheduleVo = getScheduleVo(jobId);
		if (scheduleVo.enabled) {
			TriggerKey triggerKey = new TriggerKey(jobId, SCHEDULER_GROUP_NAME);
			return scheduler.getTrigger(triggerKey).getNextFireTime();
		} else {
			return null;
		}
	}

	/**
	 * 加入 job
	 * 
	 * @param jobId
	 * @param scheduled quartz cron expression
	 * @param jobClass  job 的 class
	 * @param enabled   是否啟用
	 * @throws SchedulerException
	 */
	public void addJob(String jobId, String scheduled, Class<? extends ScheduledJob> jobClass, boolean enabled) throws SchedulerException {
		if (scheduleVoMap.containsKey(jobId)) {
			throw new SchedulerException(String.format("job id [%s] is already existed.", jobId));
		} else {
			logger.info("job id={}, class={} added.", jobId, jobClass.getName());
			ScheduleVo scheduledVo = new ScheduleVo(jobId, scheduled, jobClass, enabled);
			scheduleVoMap.put(jobId, scheduledVo);
			if (enabled) {
				scheduleJob(scheduledVo);
			}
		}
	}

	/**
	 * 將 job 加入並啟用
	 * 
	 * @param scheduledVo
	 * @throws SchedulerException
	 */
	private void scheduleJob(ScheduleVo scheduledVo) throws SchedulerException {
		JobDetail jobDetail = JobBuilder.newJob(scheduledVo.jobClass).withIdentity(scheduledVo.jobId, SCHEDULER_GROUP_NAME).storeDurably(true).build();
		JobDataMap jobDataMap = jobDetail.getJobDataMap();
		jobDataMap.put("id", scheduledVo.jobId);
		Trigger trigger = TriggerBuilder.newTrigger().withIdentity(scheduledVo.jobId, SCHEDULER_GROUP_NAME).withSchedule(CronScheduleBuilder.cronSchedule(scheduledVo.scheduled)).build();
		scheduler.scheduleJob(jobDetail, trigger);
	}

	/**
	 * 移除 job
	 * 
	 * @param jobId
	 */
	public void removeJob(String jobId) {
		try {
			ScheduleVo scheduleVo = getScheduleVo(jobId);
			scheduleVoMap.remove(jobId);
			if (scheduleVo.enabled) {
				JobKey jobKey = new JobKey(jobId, SCHEDULER_GROUP_NAME);
				scheduler.deleteJob(jobKey);
			}
		} catch (SchedulerException e) {

		}
	}

	private ScheduleVo getScheduleVo(String jobId) {
		if (scheduleVoMap.containsKey(jobId)) {
			return scheduleVoMap.get(jobId);
		} else {
			throw new RuntimeException(String.format("job id [%s] not found.", jobId));
		}
	}

	@Override
	public void close() {
		try {
			scheduler.shutdown(false);
		} catch (Exception e) {
			logger.error("{}", e);
		}
	}

	public void start() {
		try {
			scheduler.start();
		} catch (Exception e) {
			logger.error("{}", e);
		}
	}

	private static class ScheduleVo {
		String jobId;
		String scheduled;
		Class<? extends ScheduledJob> jobClass;

		boolean enabled;
		boolean isRunning;

		public ScheduleVo(String jobId, String scheduled, Class<? extends ScheduledJob> jobClass, boolean enabled) {
			this.jobId = jobId;
			this.scheduled = scheduled;
			this.jobClass = jobClass;
			this.enabled = enabled;
			this.isRunning = false;
		}
	}
}
