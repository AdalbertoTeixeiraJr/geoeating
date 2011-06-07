package br.edu.ufcg.geoeating.action;

import br.edu.ufcg.geoeating.dao.RestaurantDAO;

import com.opensymphony.xwork2.ActionSupport;

@SuppressWarnings("serial")
public class RestaurantAction extends ActionSupport{
	
	private RestaurantDAO restaurantDAO;
	
	public String test(){
		return SUCCESS;
	}

	public RestaurantDAO getRestaurantDAO() {
		return restaurantDAO;
	}

	public void setRestaurantDAO(RestaurantDAO restaurantDAO) {
		this.restaurantDAO = restaurantDAO;
	}
	
}
