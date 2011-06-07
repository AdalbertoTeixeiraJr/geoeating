package br.edu.ufcg.geoeating.bean;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="MostMovimented")
public class History {
	
	@Id
	@Column(name="id")
	private Integer id;
	
	@Column(name="average")
	private Double average;

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Double getAverage() {
		return average;
	}

	public void setAverage(Double average) {
		this.average = average;
	}


}
