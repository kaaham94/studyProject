package mybatisProject;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;

import org.apache.ibatis.io.Resources;
import org.apache.ibatis.session.SqlSession;
import org.apache.ibatis.session.SqlSessionFactory;
import org.apache.ibatis.session.SqlSessionFactoryBuilder;

public class MybatisDbConnection {

	public static void main(String[] args) {
		try {

			
			//팩토리
			String resource = "config/mybatis-config.xml";
			InputStream inputStream = Resources.getResourceAsStream(resource);
			SqlSessionFactory sqlSessionFactory = new SqlSessionFactoryBuilder().build(inputStream);
			
			

			System.out.println(sqlSessionFactory);

			//스프링빈 sqlSession
			SqlSession sqlSession = sqlSessionFactory.openSession();
			
			
			
			
			System.out.println(sqlSession);

			//가각클래스에서 @autowired sqlSession
			List list = sqlSession.selectList("my-mapper.selectTest");
			System.out.println(list);

		} catch (Exception e) {
			e.printStackTrace();
		}

	}

}
