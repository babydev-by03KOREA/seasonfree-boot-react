package com.seasonfree.client.controller;

import com.seasonfree.client.dto.request.AttendanceCheckDateRequest;
import com.seasonfree.client.dto.request.AttendanceCheckRequest;
import com.seasonfree.client.entity.Attendance;
import com.seasonfree.client.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/attendance")
@CrossOrigin
public class AttendanceController {
    private final AttendanceService attendanceService;

    // 출석체크 - [인증 필요!]
    @PostMapping("/check")
    public ResponseEntity<?> attendanceCheck(@RequestBody AttendanceCheckRequest attendanceCheckRequest) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        log.info("{}의 출석체크 시도", authentication.getName());
        try {
            // 서비스 계층에 사용자 ID와 출석체크 정보 전달
            String userEmail = authentication.getName(); // 사용자 ID 추출
            attendanceService.attendanceCheck(userEmail, attendanceCheckRequest);
            return ResponseEntity.ok().body("출석체크가 완료되었습니다!");
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("처리 중 알수없는 에러가 발생하였습니다.");
        }
    }

    // 값이 없으면 빈 배열을 반환
    @GetMapping("/list")
    public ResponseEntity<?> attendanceList(@RequestBody AttendanceCheckDateRequest attendanceCheckDateRequest) {
        final Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("인증 정보가 존재하지 않습니다.");
        }

        log.info("{}의 {}월 데이터 요청", authentication.getName(), attendanceCheckDateRequest.getMonth());

        try {
            List<Attendance> attendances = attendanceService.getAttendancesForMonth(authentication.getName(), attendanceCheckDateRequest.getMonth());
            return ResponseEntity.ok(attendances);
        } catch (UsernameNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            log.error("Error retrieving attendance data: ", e);
            return ResponseEntity.internalServerError().body("Error retrieving data");
        }
    }

    @GetMapping("/live")
    public ResponseEntity<?> getTwoLatestAttendances() {
        log.info("Fetching the top 2 latest attendance records");
        try {
            List<Attendance> latestTwoAttendances = attendanceService.findTop2ByOrderByCheckDateTimeDesc();
            return ResponseEntity.ok(latestTwoAttendances);
        } catch (Exception e) {
            log.error("Error occurred while fetching attendance records", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
