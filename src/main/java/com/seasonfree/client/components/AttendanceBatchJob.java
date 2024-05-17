package com.seasonfree.client.components;

import com.seasonfree.client.service.AttendanceService;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
@RequiredArgsConstructor
public class AttendanceBatchJob {
    private final AttendanceService attendanceService;

    @Scheduled(cron = "0 0 0 * * ?")
    public void deletePreviousDayAttendances() {
        LocalDate previousDay = LocalDate.now().minusDays(1);
        attendanceService.deletePreviousDayAttendances(previousDay);
    }
}
