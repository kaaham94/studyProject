package jdbcProject;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class DbConnection {
	
	Connection connect;

	public DbConnection() {

		String url = "jdbc:mariadb://127.0.0.1:3306/tps?characterEncoding=utf8&autoReconnect=true\r\n";
		String name = "kaaham";
		String pw = "123";
		
		// 1.Driver 로드
		try {
			Class.forName("org.mariadb.jdbc.Driver");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}

		// 2.db 연결 Connection 객체 생성 
		try {
			this.connect = DriverManager.getConnection(url, name, pw);
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	
	}
	
	
}
