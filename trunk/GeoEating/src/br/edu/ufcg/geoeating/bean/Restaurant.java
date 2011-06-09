package br.edu.ufcg.geoeating.bean;


import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.SequenceGenerator;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Entity
@Table(name = "Restaurant")
public class Restaurant {
	
	public static final int SRID = 4326;

	@Id
    @NotNull
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq")
    @SequenceGenerator(name = "seq", sequenceName = "restaurant_id_seq")
    private Integer id;
	
	@Column(name = "name")
	private String name;
	
	@Column(name = "qtt_waiting")
	private Integer qttWaiting;
	
	@Column(name = "description")
	private String description;
	
	@Column(name = "tel")
	private Long tel;
	
	@Column(name = "end_web")
	private String endWeb;
	
	@OneToOne
	@JoinColumn(name = "id")
	private History history;
	
	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getQttWaiting() {
		return qttWaiting;
	}

	public void setQttWaiting(Integer qttWaiting) {
		this.qttWaiting = qttWaiting;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public Long getTel() {
		return tel;
	}

	public void setTel(Long telInt) {
		this.tel = telInt;
	}

	public String getEndWeb() {
		return endWeb;
	}

	public void setEndWeb(String endWeb) {
		this.endWeb = endWeb;
	}

	public History getHistories() {
		return history;
	}

	public void setHistories(History histories) {
		this.history = histories;
	}

	public History getHistory() {
		return history;
	}

	public void setHistory(History history) {
		this.history = history;
	}
}
