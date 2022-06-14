package com.dark.core.listener;

import java.io.Closeable;

import org.apache.commons.io.IOUtils;
import org.apache.logging.log4j.core.LoggerContext;
import org.apache.logging.log4j.core.config.Configurator;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ApplicationContextEvent;
import org.springframework.context.event.ContextClosedEvent;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.core.io.Resource;

public class SpringApplicationListener implements ApplicationListener<ApplicationContextEvent> {

	Resource log4j2ConfigLocation;

	private LoggerContext loggerContext = null;

	private static boolean isApplicationInitialized = false;

	/**
	 * 當 Spring 初始化完成後
	 */
	private void onApplicationReady() {
		configLogging();
	}

	/**
	 * 當 Spring 結束時
	 */
	private void onApplicationDestroy() {
		IOUtils.closeQuietly((Closeable) loggerContext);
	}

	@Override
	public void onApplicationEvent(ApplicationContextEvent event) {
		if (event instanceof ContextRefreshedEvent) {
			if (!isApplicationInitialized) {
				isApplicationInitialized = true;
				onApplicationReady();
			}
		} else if (event instanceof ContextClosedEvent) {
			if (isApplicationInitialized) {
				isApplicationInitialized = false;
				onApplicationDestroy();
			}
		}
	}

	private void configLogging() {
		try {

			// 載入 log4j2 的設定檔
			loggerContext = Configurator.initialize(null, log4j2ConfigLocation.getFile().getAbsolutePath());

		} catch (Exception e) {
			throw new RuntimeException(e);
		}

	}

	public Resource getLog4j2ConfigLocation() {
		return log4j2ConfigLocation;
	}

	public void setLog4j2ConfigLocation(Resource log4j2ConfigLocation) {
		this.log4j2ConfigLocation = log4j2ConfigLocation;
	}

	public boolean isApplicationInitialized() {
		return isApplicationInitialized;
	}

}
