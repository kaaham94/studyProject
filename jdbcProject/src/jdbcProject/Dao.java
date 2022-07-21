package jdbcProject;


import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.ResultSetMetaData;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Dao {
	
	private String CURDtype;
	private String sqlQuery;
	private Object[] param;
	
	public Dao(String CURDtype ,String sqlQuery,Object[] param ) {
		this.CURDtype = CURDtype;
		this.sqlQuery = sqlQuery;
		this.param = param;
	}
	
	public Object dbConnection() throws InterruptedException, SQLException, ClassNotFoundException {

		Connection con = null;
		PreparedStatement pstmt = null;
		ResultSet rs = null;
		int ret = 0;
		Object returnValue = null;	//return ��
		
		try {
			
			// 2.Connection ��ü�� �����ϱ� DataBase �����ϱ�
			con = new DbConnection().connect;
			StringBuffer sql = new StringBuffer();
			sql.append(sqlQuery);
			
			if("I".equals(CURDtype)) {
				
				//1. Statement ��ü ���� �� �ʱ�ȭ
				Statement stmt = null;
				
				stmt = con.createStatement();
				stmt.executeQuery(sql.toString());
				
				stmt.close();
				con.close();
				//
				
				
			}else {

				
				// 3.DB�� query ������
				// - connection���� �����ϸ鼭 sql ���� db�� ���۵Ǿ�����.
				pstmt = con.prepareStatement(sql.toString());
				
				
				//4. query �� param�� ��Ī 
				int i = 0;
				for(Object obj : param) {
					i++;
					if (obj instanceof Integer) { 
						pstmt.setInt(i, (Integer) param[i-1]);
					
					} else if (obj instanceof String) {
					    pstmt.setString(i,(String) param[i-1].toString());
					}
				}
				
				// 5.�޾ƿ��� query return ��	
				// - insert, delete, update ����
				if ( "D".equals(CURDtype) || "U".equals(CURDtype)) {
					
					ret = pstmt.executeUpdate();
					
					System.out.println("Return : " + ret );
					returnValue = ret;
				
				// - select ����
				}else if ("S".equals(CURDtype)) {
					
					rs  =  pstmt.executeQuery();
					
					//- �޾ƿ� ���� List<map>�� ���� ����ش�.
					ResultSetMetaData metaData = rs.getMetaData();
					int sizeOfColumn = metaData.getColumnCount();
					
					List<Map> list = new ArrayList<Map>(); 
					Map map;
					String column;
					
					while(rs.next()) {
						map = new HashMap();
						
						for(int indexOfcolumn = 0; indexOfcolumn < sizeOfColumn ; indexOfcolumn++) {
							column = metaData.getColumnName(indexOfcolumn + 1);
							map.put(column, rs.getString(column));					
						}
						System.out.println(map.toString());
						list.add(map);
					}
					returnValue = list;
					
					
				}
			}
			
			
			
		
		} catch (SQLException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
		return returnValue;

		// 4.������
	}

	
}