import React, { useEffect, useState } from 'react'
import DatePicker from "react-horizontal-datepicker";
import { FETCH_DOCTOR_URL, TIME_OPTIONS } from '../constant';
import { Radio, Button, message } from 'antd';
import axios from 'axios';
import { unixToTime } from '../utils';

const DateTimePicker = () => {
    const [scheduleTime, setScheduleTime] = useState();
    const [scheduleDate, setScheduledDate] = useState(new Date());
    const [scheduleData, setScheduleData] = useState([]);
    const [timeOption, setTimeOption] = useState(TIME_OPTIONS);

    const selectedDay = (val) => {
        const today = new Date(val);
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1;
        let dd = today.getDate();

        if (dd < 10) dd = '0' + dd;
        if (mm < 10) mm = '0' + mm;

        const formattedToday = dd + '-' + mm + '-' + yyyy;
        setScheduledDate(formattedToday)
        const scheduleIndex = scheduleData?.schedule?.findIndex(val => val?.availability?.date === formattedToday)

        if (scheduleIndex >= 0) {
            const availableTempData = scheduleData?.schedule?.[scheduleIndex]?.available
            const unAvailableTempData = scheduleData?.schedule?.[scheduleIndex]?.unavailable
            const availableNewData = availableTempData.map(_ => {
                return { from_unix: unixToTime(_.from_unix), to_unix: unixToTime(_.to_unix) }
            })
            const unAvailableNewData = unAvailableTempData.map(_ => {
                return { from_unix: unixToTime(_.from_unix), to_unix: unixToTime(_.to_unix) }
            })
            let storeVal = [];
            availableNewData.map(_ => {
                const diff = Number(_.to_unix) - Number(_.from_unix);
                let te = null
                for (let i = 0; i < diff; i++) {
                    if (i === 0) {
                        storeVal.push({ label: _.from_unix, value: _.from_unix })
                    } else {
                        const update = te ? te + 1 : Number(_.from_unix) + 1
                        storeVal.push({ label: update.toFixed(2).toString(), value: update.toFixed(2).toString() })
                        te = update
                    }
                }
                te = null
                return null
            })
            unAvailableNewData.map(_ => {

                const diff = Number(_.to_unix) - Number(_.from_unix);
                let te = null
                for (let i = 0; i < diff; i++) {
                    if (i === 0) {
                        let indexData = storeVal.findIndex(val => val?.value === _.from_unix)
                        if (indexData >= 0) {
                            // storeVal.splice(indexData, 1);
                            storeVal[indexData] = { ...storeVal[indexData], disabled: true }
                        }
                    } else {
                        const update = te ? te + 1 : Number(_.from_unix) + 1
                        let indexData = storeVal.findIndex(val => val?.value === update.toFixed(2).toString())
                        if (indexData >= 0) {
                            // storeVal.splice(indexData, 1);
                            storeVal[indexData] = { ...storeVal[indexData], disabled: true }
                        }
                        te = update
                    }
                }
                te = null
                return null
            })
            setTimeOption([...storeVal])
            storeVal = []
        }
    };

    const onTimeSelectChange = ({ target: { value } }) => {
        setScheduleTime(value);
    };

    useEffect(() => {
        fetchAvailablity()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const fetchAvailablity = () => {
        axios.get(FETCH_DOCTOR_URL)
            .then(function (response) {
                if (response?.data) {
                    setScheduleData(JSON.parse(response?.data))
                    if (!scheduleDate) {
                        selectedDay(new Date())
                    }
                }
            })
            .catch(function (error) {
            })
            .then(function () {
                // always executed
            });
    }

    const resetStates = () => {
        // setScheduledDate()
        setScheduleTime()
    }

    const bookAppointment = () => {
        message.success(`Appointment booked for ${scheduleDate} ${scheduleTime}`, 2)
        resetStates()
    }

    return (
        <div>
            <div className='form-wrap'>
                <div className='fees-wrap'>
                    <h3><strong>Fees</strong></h3>
                    <span>$85</span>
                </div>
                <br />
                <div>
                    <h3><strong>Schedule</strong></h3>
                    <DatePicker
                        endDate={31}
                        getSelectedDay={selectedDay}
                        labelFormat={"MMMM"}
                        color={"#1890FF"}
                    />
                </div>
                <br />
                <div>
                    <h3><strong>Choose Time</strong></h3>
                    <Radio.Group buttonStyle="solid" options={timeOption} onChange={onTimeSelectChange} value={scheduleTime} optionType="button" />
                </div>
            </div>

            <br />
            <Button disabled={!scheduleTime || !scheduleDate} onClick={bookAppointment} type="primary">Book appointment</Button>
        </div>
    )
}

export default DateTimePicker