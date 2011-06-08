package br.edu.ufcg.geoeating.action;

import java.io.DataOutputStream;
import java.io.IOException;
import java.util.ArrayList;

import javax.servlet.http.HttpServletResponse;

import org.apache.struts2.ServletActionContext;

import br.edu.ufcg.geoeating.bean.FoodKindRelKey;
import br.edu.ufcg.geoeating.bean.FoodKindRelation;
import br.edu.ufcg.geoeating.bean.Restaurant;
import br.edu.ufcg.geoeating.dao.RestaurantDAO;

import com.opensymphony.xwork2.ActionSupport;

@SuppressWarnings("serial")
public class RestaurantAction extends ActionSupport{
	
	private RestaurantDAO restaurantDAO;
	
	private String name;
	
	private String tel;
	
	private String endWeb;
	
	private String description;
	
	private String latLong;
	
	private String tiposFood;
	
	private HttpServletResponse response;
	
	public String test(){
		return SUCCESS;
	}
	
	public void cadastrar() {
		DataOutputStream dos = null;
		this.response = ServletActionContext.getResponse();
		try {
			dos = new DataOutputStream(response.getOutputStream());
			if(name!=null && latLong!=null){
				try {
					int telInt = Integer.parseInt(tel);
					Restaurant r = new Restaurant();
					r.setQttWaiting(0);
					r.setName(name);
					if(endWeb!=null){
						r.setEndWeb(endWeb);
					}
					
					if(description!=null){
						r.setDescription(description);
					}
					
					if(tel!=null){
						r.setTel(telInt);
					}
					
					String[] latLongCoords = latLong.split(" ");
					String latitude = null;
					String longitude = null;
					for (String string : latLongCoords) {
						if(string.length()>0){
							if(latitude==null)
								latitude=string;
							else
								longitude=string;
						}
					}
					
					Double.parseDouble(latitude);
					
					Double.parseDouble(longitude);
					
					restaurantDAO.saveRestaurant(r);
					
					int idRest = r.getId();
					String[] tipos = tiposFood.split(" ");
					ArrayList<FoodKindRelation> relations = new ArrayList<FoodKindRelation>();
					for (String string : tipos) {
						if(string.length()>0){
							FoodKindRelKey id = new FoodKindRelKey();
							id.setId_foodkind(Integer.parseInt(string));
							id.setId_restaurant(idRest);
							FoodKindRelation rel = new FoodKindRelation();
							rel.setId(id);
							relations.add(rel);
						}
					}
					
					restaurantDAO.updateRestaurant(r, relations, latitude, longitude);
					
					dos.write("1".getBytes());
				}catch(Exception e){
					dos.write("0".getBytes());
				}finally{
					dos.close();
				}
			}
		} catch (IOException e1) {
			e1.printStackTrace();
		}
	}

	public RestaurantDAO getRestaurantDAO() {
		return restaurantDAO;
	}

	public void setRestaurantDAO(RestaurantDAO restaurantDAO) {
		this.restaurantDAO = restaurantDAO;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getTel() {
		return tel;
	}

	public void setTel(String tel) {
		this.tel = tel;
	}

	public String getEndWeb() {
		return endWeb;
	}

	public void setEndWeb(String endWeb) {
		this.endWeb = endWeb;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getLatLong() {
		return latLong;
	}

	public void setLatLong(String latLong) {
		this.latLong = latLong;
	}

	public String getTiposFood() {
		return tiposFood;
	}

	public void setTiposFood(String tiposFood) {
		this.tiposFood = tiposFood;
	}

	public HttpServletResponse getResponse() {
		return response;
	}

	public void setResponse(HttpServletResponse response) {
		this.response = response;
	}
	
}
