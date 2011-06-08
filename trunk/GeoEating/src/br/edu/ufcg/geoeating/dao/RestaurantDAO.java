package br.edu.ufcg.geoeating.dao;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;


import br.edu.ufcg.geoeating.bean.FoodKindRelation;
import br.edu.ufcg.geoeating.bean.Restaurant;

public class RestaurantDAO {
	
	protected EntityManager em;
	
	

	public EntityManager getEm() {
		return em;
	}

	@PersistenceContext()
	public void setEm(EntityManager em) {
		this.em = em;
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void saveRestaurant(Restaurant r) {
		try{
			if(getEm().contains(r)){
				getEm().merge(r);
			}else{
				getEm().persist(r);
			}
		}catch(Throwable t){
			t.printStackTrace();
		}
	}
	
	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void updateRestaurant(Restaurant r, List<FoodKindRelation> relations, String latitude, String longitude){
		if(r.getId() != null){
			String query = "UPDATE Restaurant v SET geom = GeomFromText('POINT("+longitude+" "+latitude+")', "+Restaurant.SRID+") WHERE v.id = "+r.getId();
			Query q = getEm().createQuery(query);
			q.executeUpdate();
			
			String removeRelations = "DELETE FROM RestaurantFoodKind WHERE id_restaurant = "+r.getId();
			q = getEm().createNativeQuery(removeRelations);
			q.executeUpdate();
		}
		for (FoodKindRelation foodKindRelation : relations) {
			saveFoodKindRelation(foodKindRelation);
		}
	}

	@Transactional(propagation = Propagation.REQUIRED, readOnly = false)
	public void saveFoodKindRelation(FoodKindRelation r){
		try{
			if(getEm().contains(r)){
				getEm().merge(r);
			}else{
				getEm().persist(r);
			}
		}catch(Throwable t){
			t.printStackTrace();
		}
	}
}
