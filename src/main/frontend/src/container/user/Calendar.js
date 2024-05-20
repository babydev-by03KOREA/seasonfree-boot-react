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
import {AiOutlineLeft, AiOutlineRight} from "react-icons/ai";
import {faCheck, faCircleCheck} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useForm} from "react-hook-form";
import {CalendarApi} from "../../apis/Calendar";
import Swal from "sweetalert2";

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

    // BackEnd
    // String string = "2019-01-10";
    const marks = [
        "2024-05-04",
        "2024-05-10",
        "2024-05-13",
        "2024-04-29"
    ];

    // while문은 현재 달의 첫 주 시작 날짜부터 하루씩 더해가다가 현재 달의 마지막 주 마지막 날짜보다
    // 커지면 한 달의 날짜가 끝난 것이므로 종료됩니다.
    while (startDay <= endDate) {
        for (let i = 0; i < 7; i++) {
            // 한 주는 7일이므로 7번의 반복문 실행
            formattedDate = format(startDay, "yyyy-MM-dd"); // 날짜의 데이터는 "yyyy-MM-dd" 형식으로 format됩니다.
            const isMarked = marks.includes(formattedDate); // marks 배열에 현재 날짜가 포함되어 있는지 확인
            days.push(
                <Day key={startDay}>
                    <DaySpan
                        style={{
                            color: format(currentDate, "MM") !== format(startDay, "MM")
                                ? "#ddd"
                                : isSunday(startDay)
                                    ? "red"
                                    : isSaturday(startDay)
                                        ? "blue"
                                        : "#000",
                        }}
                    >
                        {format(startDay, "d")} {isMarked && <FontAwesomeIcon icon={faCheck} style={{color: "red"}}/>}
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

    const {register, handleSubmit, formState: {errors}} = useForm();

    const onSubmit = async (formData) => {
        try {
            const today = new Date().toISOString().split('T')[0];  // 'YYYY-MM-DD' 형식의 문자열
            const { comment } = formData;  // form에서 'comment'를 추출합니다.
            const result = await CalendarApi(today, comment);
            Swal.fire({
                title: "성공",
                text: "출석체크에 성공하였습니다.",
                icon: "success"
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "에러",
                text: error.message
            });
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <CalendarContainer>
                <Header>
                    <TodayText>{moment(currentDate).format("YYYY/MM/DD")}</TodayText>
                    <MonthButton>
                        <Button onClick={prevMonth}>
                            <AiOutlineLeft size={15} color="#000"/>
                        </Button>
                        <Title>
                            {format(currentDate, "yyyy")}년 {format(currentDate, "M")}월
                        </Title>
                        <Button onClick={nextMonth}>
                            <AiOutlineRight size={15} color="#000"/>
                        </Button>
                    </MonthButton>
                </Header>
                <CalendarBox>
                    <CalendarBox>
                        <WeekLayout>{weeks}</WeekLayout>
                        <DayLayout>{day}</DayLayout>
                    </CalendarBox>
                </CalendarBox>
                <CheckNoticeRow>
                    <FontAwesomeIcon icon={faCircleCheck} style={{height: "35px"}}/>
                    <CheckNotice>출석 시 100P 지급됩니다.</CheckNotice>
                </CheckNoticeRow>
                <AttendanceBox>
                    <InputComponent
                        placeholder="오늘의 한마디를 남겨주세요(10자 이상)"
                        {...register("comment", { required: true, minLength: 10 })}
                    />
                    {errors.comment && errors.comment.type === "required" && <div style={{color: "red"}}>한마디를 입력해주세요.</div>}
                    {errors.comment && errors.comment.type === "minLength" && <div style={{color: "red"}}>한마디는 최소 10자 이상이어야 합니다.</div>}
                </AttendanceBox>
                <SubmitButton>출석체크하기</SubmitButton>
            </CalendarContainer>
        </form>
    );
}

const CalendarContainer = styled.div``;

const MonthButton = styled.div`
    display: flex;
`;

const TodayText = styled.div`
    font-size: 25px;
    font-weight: bold;
    margin-left: 20px;
`;

const Header = styled.div`
    display: flex;
    justify-content: space-between;
`;

const Title = styled.div`
    font-size: 20px;
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

const CheckNoticeRow = styled.div`
    height: 35px;
    margin-top: 20px;
    display: flex;
    flex-direction: row;
    align-items: center;
`;

const AttendanceBox = styled.div`
    margin: 20px 0;
`;

const CheckNotice = styled.div`
    width: 100%;
    height: 100%;
    text-align: center;
    font-weight: bold;
    background-color: gray;
    border: 1px solid black;
    margin-left: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const WeekLayout = styled.div`
    display: flex;
`;

const Week = styled.div`
    width: 14.28%;
    color: white;
    background-color: #282c34;
    font-weight: bold;
    display: flex;
    justify-content: center;
    border: 1px solid black;
    //border-radius: 10px;
    padding: 10px;
`;

const DayLayout = styled.div`
    width: 100%;
    //margin-top: 10px;
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
    border: 1px solid black;
`;

const DaySpan = styled.span`
    padding: 10px;
    border-radius: 50%;
    position: relative;
    font-weight: 700;
`;

const InputComponent = styled.input`
    width: 97%;
    padding: 8px;
    margin: 10px 0;
`;

const SubmitButton = styled.button`
    width: 100%;
    padding: 10px;
    background-color: #4CAF50;
    color: white;
    font-size: 16px;
    font-weight: bold;
    cursor: pointer;
    border: none;
    border-radius: 5px;
`;

export default CalendarComponent;