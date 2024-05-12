import styled from "styled-components";
import {useState} from "react";
import moment from "moment";
import {
    format,
    addMonths,
    subMonths,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    addDays,
    isSaturday,
    isSunday,
} from "date-fns";
import { AiOutlineLeft, AiOutlineRight } from "react-icons/ai";

const CalendarComponent = () => {
    const week = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
    const [currentDate, setCurrentDate] = useState(new Date());
    const monthStart = startOfMonth(currentDate); // 현재 달의 시작 날짜 (2023-08-01)
    const monthEnd = endOfMonth(monthStart); // 현재 달의 마지막 날짜 (2023-08-31)
    const startDate = startOfWeek(monthStart); // 현재 달의 첫 주 시작 날짜 (2023-07-30)
    const endDate = endOfWeek(monthEnd); // 현재 달의 마지막 주 마지막 날짜 (2023-09-02)

    // week 배열을 순회하면서 요일을 하나씩 출력
    const weeks = week.map((item, index) => {
        return <Week key={index}>{item}</Week>;
    });

    const day = []; // 한 달의 전체 데이터
    let startDay = startDate; // 현재 달의 첫 주 시작 날짜
    let days = []; // 한 주의 전체 데이터
    let formattedDate = ""; // 배열 삽입용 하루 날짜의 데이터

    // while문은 현재 달의 첫 주 시작 날짜부터 하루씩 더해가다가 현재 달의 마지막 주 마지막 날짜보다
    // 커지면 한 달의 날짜가 끝난 것이므로 종료됩니다.
    while (startDay <= endDate) {
        for (let i = 0; i < 7; i++) {
            // 한 주는 7일이므로 7번의 반복문 실행
            formattedDate = format(startDay, "d"); // 날짜의 데이터는 숫자로 format됩니다.
            days.push(
                // 한 주의 배열에 하루씩 날짜 삽입합니다.
                <Day>
                    <DaySpan
                        style={{
                            color:
                            // 현재 날짜가 이번 달의 데이터가 아닐 경우 회색으로 표시
                            // date-fns의 함수를 사용해 일요일이면 빨간색, 토요일이면 파란색으로 표시
                            // 나머지 날짜는 이번 달의 정상적인 데이터이므로 검은색으로 표시
                                format(currentDate, "M") !== format(startDay, "M")
                                    ? "#ddd"
                                    : isSunday(startDay)
                                        ? "red"
                                        : isSaturday(startDay)
                                            ? "blue"
                                            : "#000",
                        }}
                    >
                        {formattedDate}
                    </DaySpan>
                </Day>
            );
            startDay = addDays(startDay, 1); // 하루를 삽입하고 날짜를 하루 더해줍니다.
        }
        // for문이 종료되면 7일의 날짜가 한 주의 데이터에 모두 삽입된 것
        // 한 주의 데이터를 한 달의 전체 데이터에 삽입해줍니다.
        day.push(<DayBox key={startDay}>{days}</DayBox>);

        // 다음 주의 데이터를 삽입하기 위해 한 주의 데이터를 초기화 시켜줍니다.
        days = [];
    }

    // date-fns 함수인 subMonths를 사용하여 클릭 시 현재 달에서 1달을 빼줌
    const prevMonth = () => {
        setCurrentDate(subMonths(currentDate, 1));
    };

    // date-fns 함수인 addMonths를 사용하여 클릭 시 현재 달에서 1달을 더해줌
    const nextMonth = () => {
        setCurrentDate(addMonths(currentDate, 1));
    };

    const marks = [
        "15-02-2024",
        "03-01-2024",
        "07-04-2024",
        "12-05-2024",
        "13-05-2024",
        "15-05-2024",
    ];

    return (
        <CalendarContainer>
            <CalendarDateRow>
                <TodayText>{moment(currentDate).format("YYYY/MM/DD")}</TodayText>
            </CalendarDateRow>
            <StyledCalendarWrapper>
                <Layout>
                    <Header>
                        <Button onClick={prevMonth}>
                            <AiOutlineLeft size={24} color="#000" />
                        </Button>
                        <Title>
                            {format(currentDate, "yyyy")}년 {format(currentDate, "M")}월
                        </Title>
                        <Button onClick={nextMonth}>
                            <AiOutlineRight size={24} color="#000" />
                        </Button>
                    </Header>
                    <CalendarBox>
                        <CalendarBox>
                            <WeekLayout>{weeks}</WeekLayout>
                            <DayLayout>{day}</DayLayout>
                        </CalendarBox>
                    </CalendarBox>
                </Layout>
            </StyledCalendarWrapper>
        </CalendarContainer>
    );
}

const CalendarContainer = styled.div`

`;

const CalendarTitle = styled.span`

`;

const CalendarDateRow = styled.div`

`;

const TodayText = styled.span``;

const Layout = styled.div`
  max-width: 1300px;
  margin: 100px auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: center;
`;

const Title = styled.div`
  font-size: 36px;
  color: #000;
  font-weight: 700;
  display: flex;
  align-items: center;
`;

const Button = styled.div`
  margin: 0 24px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CalendarBox = styled.div`
  margin-top: 40px;
`;

const WeekLayout = styled.div`
  display: flex;
`;

const Week = styled.div`
  width: 14.28%;
  color: #8f8f8f;
  display: flex;
  justify-content: center;
  border: 1px solid #ddd;
  border-radius: 10px;
  padding: 10px;
`;

const DayLayout = styled.div`
  width: 100%;
  margin-top: 10px;
`;

const DayBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Day = styled.div`
  width: 14.28%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border: 1px solid #ddd;
`;

const DaySpan = styled.span`
  padding: 10px;
  border-radius: 50%;
  position: relative;
  font-weight: 700;
`;

// 캘린더를 감싸주는 스타일
const StyledCalendarWrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    position: relative;
`

export default CalendarComponent;