package com.seasonfree.client.repository;

import com.seasonfree.client.entity.CustomerService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CustomerServiceRepository extends JpaRepository<CustomerService, Long> {

}
