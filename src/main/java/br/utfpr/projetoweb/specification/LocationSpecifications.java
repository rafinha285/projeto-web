package br.utfpr.projetoweb.specification;

import br.utfpr.projetoweb.entities.LocationEntity;
import org.springframework.data.jpa.domain.Specification;

import java.util.Date;

public class LocationSpecifications {
    public static Specification<LocationEntity> name(String name) {
        return (root, query, criteriaBuilder) -> {
            if(name == null || name.trim().isEmpty()){
                return null;
            }
            return criteriaBuilder.like(criteriaBuilder.lower(root.get("name")), "%"+name.toLowerCase()+"%");
        };
    }

    public static Specification<LocationEntity> startDate(Date startDate) {
        return (root, query, cb) -> {
            if (startDate == null) return null;
            // start_date >= startDate
            return cb.greaterThanOrEqualTo(root.get("startDate"), startDate);
        };
    }

    public static Specification<LocationEntity> endDate(Date endDate) {
        return (root, query, cb) -> {
            if (endDate == null) return null;
            // end_date <= endDate
            return cb.lessThanOrEqualTo(root.get("endDate"), endDate);
        };
    }
}
