package br.edu.ufcg.geoeating.bean;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class HistoryKey {
	
	@Column(name="id_restaurant")
	private Integer id_restaurant;
	
	@Column(name="date")
	private Date date;

	public Integer getId_restaurant() {
		return id_restaurant;
	}

	public void setId_restaurant(Integer id_restaurant) {
		this.id_restaurant = id_restaurant;
	}

	public Date getDate() {
		return date;
	}

	public void setDate(Date date) {
		this.date = date;
	}

}
