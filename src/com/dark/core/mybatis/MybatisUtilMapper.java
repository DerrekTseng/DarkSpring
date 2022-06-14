package com.dark.core.mybatis;

import java.util.List;

import org.apache.ibatis.annotations.DeleteProvider;
import org.apache.ibatis.annotations.InsertProvider;
import org.apache.ibatis.annotations.SelectProvider;
import org.apache.ibatis.annotations.UpdateProvider;
import org.mybatis.dynamic.sql.delete.render.DeleteStatementProvider;
import org.mybatis.dynamic.sql.insert.render.InsertStatementProvider;
import org.mybatis.dynamic.sql.select.render.SelectStatementProvider;
import org.mybatis.dynamic.sql.update.render.UpdateStatementProvider;
import org.mybatis.dynamic.sql.util.SqlProviderAdapter;

public interface MybatisUtilMapper {

	/**
	 * 直接執行 SQL Update
	 * 
	 * @param sql
	 * @return
	 */
	int executeUpdateSql(String sql);

	/**
	 * 直接執行 SQL Select
	 * 
	 * @param <E>
	 * @param sql
	 * @return
	 */
	<E> List<E> executeSelectSql(String sql);

	/**
	 * 執行 Dynamic SQL Select
	 * 
	 * @param selectStatement
	 * @return
	 */
	@SelectProvider(type = SqlProviderAdapter.class, method = "select")
	List<MyHashMap> select(SelectStatementProvider selectStatement);

	/**
	 * 執行 Dynamic SQL Count
	 * 
	 * @param selectStatement
	 * @return
	 */
	@SelectProvider(type = SqlProviderAdapter.class, method = "select")
	long count(SelectStatementProvider selectStatement);

	/**
	 * 執行 Dynamic SQL Update
	 * 
	 * @param updateStatement
	 * @return
	 */
	@UpdateProvider(type = SqlProviderAdapter.class, method = "update")
	int update(UpdateStatementProvider updateStatement);

	/**
	 * 執行 Dynamic SQL Delete
	 * 
	 * @param deleteStatement
	 * @return
	 */
	@DeleteProvider(type = SqlProviderAdapter.class, method = "delete")
	int delete(DeleteStatementProvider deleteStatement);

	/**
	 * 執行 Dynamic SQL Insert
	 * 
	 * @param <E>
	 * 
	 * @param insertStatement
	 * @return
	 */
	@InsertProvider(type = SqlProviderAdapter.class, method = "insert")
	<T> int insert(InsertStatementProvider<T> insertStatement);

}
