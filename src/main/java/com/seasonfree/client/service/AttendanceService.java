package com.seasonfree.client.service;

import com.seasonfree.client.dto.request.AttendanceCheckRequest;
import com.seasonfree.client.entity.Attendance;
import com.seasonfree.client.entity.User;
import com.seasonfree.client.repository.AttendanceRepository;
import com.seasonfree.client.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.*;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

@Slf4j
@RequiredArgsConstructor
@Service
public class AttendanceService {
    private final UserRepository userRepository;

    private final AttendanceRepository attendanceRepository;

    @Transactional(readOnly = true)
    protected User returnOptionalUserObject(String userEmail) {
        Optional<User> optionalUser = userRepository.findUserByEmail(userEmail);
        if (!optionalUser.isPresent()) {
            throw new UsernameNotFoundException("해당하는 이메일의 유저를 찾을 수 없습니다. by:" + userEmail);
        }

        return optionalUser.get();
    }

    @Transactional(readOnly = false)
    public void attendanceCheck(String userEmail, AttendanceCheckRequest attendanceCheckRequest) {
        LocalDateTime localDateTime = LocalDateTime.parse(attendanceCheckRequest.getToday(), DateTimeFormatter.ISO_LOCAL_DATE_TIME);

        Attendance attendance = Attendance.builder()
                .user(returnOptionalUserObject(userEmail))
                .checkDateTime(localDateTime)
                .comment(attendanceCheckRequest.getComment())
                .build();
        attendanceRepository.save(attendance);
    }

    @Transactional(readOnly = true)
    public List<Attendance> getAttendancesForMonth(String userEmail, String month) {
        Optional<User> optionalUser = userRepository.findUserByEmail(userEmail);
        if (!optionalUser.isPresent()) {
            throw new UsernameNotFoundException("해당하는 이메일의 유저를 찾을 수 없습니다. by:" + userEmail);
        }
        User user = optionalUser.get();

        YearMonth yearMonth = YearMonth.parse(month, DateTimeFormatter.ofPattern("yyyy-MM"));
        LocalDate startOfMonth = yearMonth.atDay(1);
        LocalDate endOfMonth = yearMonth.atEndOfMonth();

        return attendanceRepository.findByUserAndCheckDateTimeBetween(returnOptionalUserObject(userEmail), startOfMonth, endOfMonth);
    }

    // 매일 자정에 오늘 작성된 Comment 전체 삭제하기
    @Transactional(readOnly = true)
    public List<Attendance> findTop2ByOrderByCheckDateTimeDesc() {
        return attendanceRepository.findTop2ByOrderByCheckDateTimeDesc();
    }

    @Transactional
    public void deletePreviousDayAttendances(LocalDate date) {
        LocalDate previousDay = LocalDate.now().minusDays(1);
        attendanceRepository.deleteAllByCheckDateTime(previousDay);
    }
}
