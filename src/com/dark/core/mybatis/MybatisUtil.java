package com.dark.core.mybatis;

import java.sql.Connection;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import org.apache.commons.beanutils.BeanUtils;
import org.apache.ibatis.executor.BatchResult;
import org.apache.ibatis.session.Configuration;
import org.apache.ibatis.session.ResultHandler;
import org.apache.ibatis.session.RowBounds;
import org.mybatis.dynamic.sql.delete.render.DeleteStatementProvider;
import org.mybatis.dynamic.sql.insert.render.InsertStatementProvider;
import org.mybatis.dynamic.sql.select.render.SelectStatementProvider;
import org.mybatis.dynamic.sql.update.render.UpdateStatementProvider;
import org.mybatis.spring.support.SqlSessionDaoSupport;

import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;

public class MybatisUtil extends SqlSessionDaoSupport {

	/**
	 * 直接執行 SQL Update
	 * 
	 * @param <E>
	 * @param sql
	 * @return
	 */
	public <E> List<E> executeSelectSql(String sql) {
		return getMapper(MybatisUtilMapper.class).executeSelectSql(sql);
	}

	/**
	 * 直接執行 SQL Select
	 * 
	 * @param sql
	 * @return
	 */
	public int executeUpdateSql(String sql) {
		return getMapper(MybatisUtilMapper.class).executeUpdateSql(sql);
	}

	/**
	 * 執行 Dynamic SQL Select
	 * 
	 * @param statementProvider
	 * @return
	 */
	public <T> List<T> select(Class<T> type, SelectStatementProvider statementProvider) {
		List<MyHashMap> result = select(statementProvider);
		return result.stream().map(map -> {
			return createBean(type, map);
		}).collect(Collectors.toList());
	}

	private <T> T createBean(Class<T> type, MyHashMap map) {
		try {
			T bean = type.getConstructor().newInstance();
			BeanUtils.populate(bean, map);
			return bean;
		} catch (Exception e) {
			throw new RuntimeException(e);
		}
	}

	/**
	 * 執行 Dynamic SQL Select
	 * 
	 * @param statementProvider
	 * @return
	 */
	public List<MyHashMap> select(SelectStatementProvider statementProvider) {
		return getMapper(MybatisUtilMapper.class).select(statementProvider);
	}

	/**
	 * 執行 Dynamic SQL Count
	 * 
	 * @param statementProvider
	 * @return
	 */
	public long count(SelectStatementProvider statementProvider) {
		return getMapper(MybatisUtilMapper.class).count(statementProvider);
	}

	/**
	 * 執行 Dynamic SQL Update
	 * 
	 * @param <T>
	 * @param insertStatement
	 * @return
	 */
	public <T> int insert(InsertStatementProvider<T> insertStatement) {
		return getMapper(MybatisUtilMapper.class).insert(insertStatement);
	}

	/**
	 * 執行 Dynamic SQL Delete
	 * 
	 * @param statementProvider
	 * @return
	 */
	public int update(UpdateStatementProvider statementProvider) {
		return getMapper(MybatisUtilMapper.class).update(statementProvider);
	}

	/**
	 * 執行 Dynamic SQL Insert
	 * 
	 * @param statementProvider
	 * @return
	 */
	public int delete(DeleteStatementProvider statementProvider) {
		return getMapper(MybatisUtilMapper.class).delete(statementProvider);
	}

	/**
	 * PageHelper 分頁
	 * 
	 * @param <T>       ResultType 回傳的型別
	 * @param id        XML SQL 的 ID
	 * @param pageNum   頁次
	 * @param pageSize  一頁的大小
	 * @param orderby   字串 EX: "rowid desc" 或 "rowid asc"
	 * @param parameter 查詢參數
	 * @return
	 */
	public <T> PageInfo<T> pageQuery(String id, int pageNum, int pageSize, String orderby, Object parameter) {
		PageHelper.startPage(pageNum, pageSize, orderby);
		List<T> result = getSqlSession().selectList(id, parameter);
		return new PageInfo<T>(result, pageSize);
	}

	public void clearCache() {
		getSqlSession().clearCache();
	}

	public void close() {
		getSqlSession().close();
	}

	public void commit() {
		getSqlSession().commit();
	}

	public void commit(boolean force) {
		getSqlSession().commit(force);
	}

	public int delete(String statement, Object parameter) {
		return getSqlSession().delete(statement, parameter);
	}

	public int delete(String statement) {
		HashMap<String, String> parameter = new HashMap<>();
		return getSqlSession().delete(statement, parameter);
	}

	public List<BatchResult> flushStatements() {
		return getSqlSession().flushStatements();
	}

	public Configuration getConfiguration() {
		return getSqlSession().getConfiguration();
	}

	public Connection getConnection() {
		return getSqlSession().getConnection();
	}

	public <T> T getMapper(Class<T> type) {
		return getSqlSession().getMapper(type);
	}

	public int insert(String statement, Object parameter) {
		return getSqlSession().insert(statement, parameter);
	}

	public int insert(String statement) {
		HashMap<String, String> parameter = new HashMap<>();
		return getSqlSession().insert(statement, parameter);
	}

	public void rollback() {
		getSqlSession().rollback();
	}

	public void rollback(boolean force) {
		getSqlSession().rollback(force);
	}

	public void select(String statement, Object parameter, ResultHandler<?> handler) {
		getSqlSession().select(statement, parameter, handler);
	}

	public void select(String statement, Object parameter, RowBounds rowBounds, ResultHandler<?> handler) {
		getSqlSession().select(statement, parameter, rowBounds, handler);
	}

	public void select(String statement, ResultHandler<?> handler) {
		getSqlSession().select(statement, handler);
	}

	public <E> List<E> selectList(String statement, Object parameter) {
		return getSqlSession().selectList(statement, parameter);
	}

	public <E> List<E> selectList(String statement) {
		HashMap<String, String> parameter = new HashMap<>();
		return getSqlSession().selectList(statement, parameter);
	}

	public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey, RowBounds rowBounds) {
		return getSqlSession().selectMap(statement, parameter, mapKey, rowBounds);
	}

	public <K, V> Map<K, V> selectMap(String statement, Object parameter, String mapKey) {
		return getSqlSession().selectMap(statement, parameter, mapKey);
	}

	public <K, V> Map<K, V> selectMap(String statement, String mapKey) {
		return getSqlSession().selectMap(statement, mapKey);
	}

	public <T> T selectOne(String statement, Object parameter) {
		return getSqlSession().selectOne(statement, parameter);
	}

	public <T> T selectOne(String statement) {
		HashMap<String, String> parameter = new HashMap<>();
		return getSqlSession().selectOne(statement, parameter);
	}

	public int update(String statement, Object parameter) {
		return getSqlSession().update(statement, parameter);
	}

	public int update(String statement) {
		return getSqlSession().update(statement);
	}
}
