package br.edu.ufcg.geoeating.dao;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

public class RestaurantDAO {
	
	protected EntityManager em;
	
	

	public EntityManager getEm() {
		return em;
	}

	@PersistenceContext()
	public void setEm(EntityManager em) {
		this.em = em;
	}

}
