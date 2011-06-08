package br.edu.ufcg.geoeating.bean;

import javax.persistence.EmbeddedId;
import javax.persistence.Entity;
import javax.persistence.Table;

@Entity
@Table(name="RestaurantFoodKind")
public class FoodKindRelation {

	@EmbeddedId
	private FoodKindRelKey id;
	
	public FoodKindRelKey getId() {
		return id;
	}

	public void setId(FoodKindRelKey id) {
		this.id = id;
	}
}
