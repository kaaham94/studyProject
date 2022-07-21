package jdbcProject;

import java.sql.SQLException;
import java.util.List;
import java.util.Map;

public class infoDao  {

	
	
	public List<Map> selectList() throws ClassNotFoundException, InterruptedException, SQLException{
		
	
		String sqlQuery = "select * from userInfo";
		Object[] param = {};
		
		Dao dao = new Dao("S",sqlQuery,param);
		List<Map> selectList = (List<Map>) dao.dbConnection();
		
		return selectList; 
	}

	

	public void insertUserinfo(Object[] param) throws ClassNotFoundException, InterruptedException, SQLException{
		
	
		String sqlQuery = "insert into userInfo(age, name) values("+ (Integer) param[0] +",'"+ param[1].toString() +"')"; 
		
		
		Dao dao = new Dao("I",sqlQuery,param);
		dao.dbConnection();

	}
	
	
	public void deleteUserinfo() throws ClassNotFoundException, InterruptedException, SQLException{
		
		String sqlQuery = "delete from userInfo where name = ? "; 
		Object [] param = {"jh"};
		
		Dao dao = new Dao("D",sqlQuery,param);
		dao.dbConnection();
	}
}
