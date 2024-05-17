package com.seasonfree.client.repository;

import com.seasonfree.client.entity.Attendance;
import com.seasonfree.client.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {
    List<Attendance> findByUserAndCheckDateTimeBetween(User user, LocalDate startDate, LocalDate endDate);
    List<Attendance> findTop2ByOrderByCheckDateTimeDesc();
    void deleteAllByCheckDateTime(LocalDate date);
}
