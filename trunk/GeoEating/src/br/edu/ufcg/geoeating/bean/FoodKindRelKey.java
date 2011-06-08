package br.edu.ufcg.geoeating.bean;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@SuppressWarnings("serial")
@Embeddable
public class FoodKindRelKey implements Serializable{
	
	@Column(name="id_restaurant")
	private Integer id_restaurant;
	
	@Column(name="id_foodkind")
	private Integer id_foodkind;
	
	public Integer getId_restaurant() {
		return id_restaurant;
	}

	public void setId_restaurant(Integer id_restaurant) {
		this.id_restaurant = id_restaurant;
	}

	public Integer getId_foodkind() {
		return id_foodkind;
	}

	public void setId_foodkind(Integer id_foodkind) {
		this.id_foodkind = id_foodkind;
	}

}
