package jdbcProject;

import java.sql.SQLException;
import jdbcProject.infoDao;

public class DbManager {
	public static void main(String[] args) throws InterruptedException, SQLException, ClassNotFoundException {
		testCase_I();
		testCase_S();
	}

	public static void testCase_D() {
		infoDao infoDao = new infoDao();

		try {
			infoDao.deleteUserinfo();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

	}
	public static void testCase_I() {
		infoDao infoDao = new infoDao();
		
		Object[] param = { 29, "jh"};
		
		try {
			infoDao.insertUserinfo(param);
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}
	public static void testCase_S() {
		infoDao infoDao = new infoDao();
		
		try {
			infoDao.selectList();
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (InterruptedException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
	}

}
