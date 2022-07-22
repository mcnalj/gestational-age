window.addEventListener('load', function () {
  let lmpDate, conceptionDate, gestationalAgeTotalDays, gestationalWeeks, gestationalDays, gestationalAge, eddDate;
  let message = "";
  let lmpToEdd = 1000 * 60 * 60 * 24 * 280; //280 days from lmp to edd
  let lmpToConception = 1000 * 60 * 60 * 24 * 14 // 14 days from lmp to conception
  // set and display calculation date as today and get timezone offset
  let calculationDateObj = new Date();
  let tmzOffset = calculationDateObj.getTimezoneOffset() * 60 * 1000;
  let calculationDateFormatted = convertDateObjToInputFormat(calculationDateObj);
  document.getElementById("calculationDate").value=calculationDateFormatted;
  let calculationDate = calculationDateFormatted

  document.getElementById("messageElement").style.visibility = "hidden";

  form = document.getElementById("calculator");
  form.addEventListener("submit", function(event) {
    event.preventDefault();
    let submittedCalculationDate = document.getElementById("calculationDate").value
    let submittedLmpDate = document.getElementById("lmpDate").value
    let submittedConceptionDate = document.getElementById("conceptionDate").value
    let submittedGestationalWeeks = document.getElementById("gestationalWeeks").value
    let submittedGestationalDays = document.getElementById("gestationalDays").value
    let submittedEddDate = document.getElementById("eddDate").value

    // this is main()
    // handle case where no dates are entered
    if (!submittedLmpDate && !submittedConceptionDate && submittedGestationalWeeks == 'Weeks' && submittedGestationalDays == 'Days' && !submittedEddDate) {
      message = "Please enter an LMP date, conception date, gestational age or EDD date.";
      showMessage("white", message);
    // handle case where a date has been entered and now only the calculation date is changed
    } else if (calculationDate != submittedCalculationDate && (lmpDate == submittedLmpDate && conceptionDate == submittedConceptionDate && gestationalWeeks == submittedGestationalWeeks && gestationalDays == submittedGestationalDays && eddDate == submittedEddDate)) {
      let lmpObject = getDateObjFromEnteredDate(lmpDate);
      calculationDate = submittedCalculationDate;
      [gestationalWeeks, gestationalDays] = getGestationalAgeFromLmpDateObjAndSubmittedCalculationDate(lmpObject, submittedCalculationDate);
      document.getElementById("gestationalWeeks").value=gestationalWeeks;
      document.getElementById("gestationalDays").value=gestationalDays;
      message = "Gestational age has been updated based on the updated calculation date."
      showMessage("white", message);
    // handle case where lmp is entered or changed
    } else if (lmpDate != submittedLmpDate && submittedLmpDate) {
      lmpDate = submittedLmpDate;
      let lmpObject = getDateObjFromEnteredDate(lmpDate);
      let conceptionDateFormatted = getConceptionDateFromLmpDateObj(lmpObject);
      document.getElementById("conceptionDate").value=conceptionDateFormatted;
      conceptionDate = conceptionDateFormatted;
      [gestationalWeeks, gestationalDays] = getGestationalAgeFromLmpDateObjAndSubmittedCalculationDate(lmpObject, submittedCalculationDate);
      document.getElementById("gestationalWeeks").value=gestationalWeeks;
      document.getElementById("gestationalDays").value=gestationalDays;
      let eddFormatted = getEddDateFromLmpDateObj(lmpObject);
      document.getElementById("eddDate").value=eddFormatted;
      eddDate = eddFormatted;
      message = "Calculations are based on the provided date for first day of Last Menstrual Period.";
      showMessage("white", message);
    // handle case where conceptionDate is entered or changed
    } else if (conceptionDate != submittedConceptionDate && submittedConceptionDate){
      conceptionDate = submittedConceptionDate;
      let conceptionDateObj = getDateObjFromEnteredDate(conceptionDate);
      let lmpObject = getLmpObjFromConceptionDateObj(conceptionDateObj);
      let lmpFormatted = convertDateObjToInputFormat(lmpObject);
      document.getElementById("lmpDate").value=lmpFormatted;
      lmpDate = lmpFormatted;
      [gestationalWeeks, gestationalDays] = getGestationalAgeFromLmpDateObjAndSubmittedCalculationDate(lmpObject, submittedCalculationDate);
      document.getElementById("gestationalWeeks").value=gestationalWeeks;
      document.getElementById("gestationalDays").value=gestationalDays;
      let eddFormatted = getEddDateFromLmpDateObj(lmpObject);
      document.getElementById("eddDate").value=eddFormatted;
      eddDate = eddFormatted;
      message = "Calculations are based on the provided Conception Date.";
      showMessage("white", message);
    // handle case where edd is entered or changed
    } else if (eddDate != submittedEddDate && submittedEddDate) {
      eddDate = submittedEddDate;
      let eddDateObj = getDateObjFromEnteredDate(eddDate);
      let lmpObject = getLmpObjFromEddDateObj(eddDateObj);
      let lmpFormatted = convertDateObjToInputFormat(lmpObject);
      document.getElementById("lmpDate").value=lmpFormatted;
      lmpDate = lmpFormatted;
      let conceptionDateFormatted = getConceptionDateFromLmpDateObj(lmpObject);
      document.getElementById("conceptionDate").value=conceptionDateFormatted;
      conceptionDate = conceptionDateFormatted;
      [gestationalWeeks, gestationalDays] = getGestationalAgeFromLmpDateObjAndSubmittedCalculationDate(lmpObject, submittedCalculationDate);
      document.getElementById("gestationalWeeks").value=gestationalWeeks;
      document.getElementById("gestationalDays").value=gestationalDays;
      message = "Calculations are based on the provided EDD.";
      showMessage("white", message);
    // handle case where gestational age is entered or changed
    } else if ((gestationalWeeks != submittedGestationalWeeks || gestationalDays != submittedGestationalDays) && submittedGestationalWeeks) {
      gestationalWeeks = parseInt(submittedGestationalWeeks);
      gestationalDays = parseInt(submittedGestationalDays);
      let gestationalDaysTotal = (7 * gestationalWeeks) + gestationalDays;
      calculationDate = submittedCalculationDate;
      let lmpObject = getLmpObjectFromGestationalDaysTotalAndSubmittedCalculationDate(gestationalDaysTotal, submittedCalculationDate);
      let lmpFormatted = convertDateObjToInputFormat(lmpObject);
      document.getElementById("lmpDate").value=lmpFormatted;
      lmpDate = lmpFormatted;
      let conceptionDateFormatted = getConceptionDateFromLmpDateObj(lmpObject);
      document.getElementById("conceptionDate").value=conceptionDateFormatted;
      conceptionDate = conceptionDateFormatted;
      let eddFormatted = getEddDateFromLmpDateObj(lmpObject);
      document.getElementById("eddDate").value=eddFormatted;
      eddDate = eddFormatted;
      message = "Calculations are based on the provided Gestational Age.";
      showMessage("white", message);
    }
  });

  // Translate a date object into a date formatted for display ("2022-07-04")
  function convertDateObjToInputFormat(dateObj) {
    let year = dateObj.getFullYear()
    let month = dateObj.getMonth()
    let formattedMonth = convertMonthToInputFormat(month);
    let date = dateObj.getDate()
    let formattedDate = convertDateToInputFormat(date);
    let formatted = `${year}-${formattedMonth}-${formattedDate}`
    return formatted;
  }

  // Translate months from javascript object to displayable string
  function convertMonthToInputFormat(month) {
    let formatted = month + 1;
    if (formatted < 10) {
      formatted = "0" + formatted.toString();
    } else {
      formatted = formatted.toString();
    }
    return formatted;
  }

  // Translate days of the month from javascript object to displayable string
  function convertDateToInputFormat(date) {
    let formatted = date;
    if (formatted < 10) {
      formatted = "0" + formatted.toString();
    } else {
      formatted = formatted.toString();
    }
    return formatted;
  }

  // Calculate EDD given LMP and return EDD formatted for display.
  function getEddDateFromLmpDateObj(lmpObj) {
    let lmpMilliseconds = lmpObj.getTime();
    let eddMilliseconds = lmpMilliseconds + lmpToEdd;
    let constructorMilliseconds = eddMilliseconds + tmzOffset;
    let eddObj = new Date(constructorMilliseconds);
    let eddFormatted = convertDateObjToInputFormat(eddObj);
    return eddFormatted;
  }

  // Calculate conception given LMP and return conceptionDate formatted for display.
  function getConceptionDateFromLmpDateObj(lmpObj) {
    let lmpMilliseconds = lmpObj.getTime();
    let conceptionDateMilliseconds = lmpMilliseconds + lmpToConception;
    let constructorMilliseconds = conceptionDateMilliseconds + tmzOffset;
    let conceptionObj = new Date(constructorMilliseconds);
    let conceptionDateFormatted = convertDateObjToInputFormat(conceptionObj);
    return conceptionDateFormatted;
  }

  // Calculate gestational age given LMP (as of the calculation date) and return age as weeks and days.
  function getGestationalAgeFromLmpDateObjAndSubmittedCalculationDate(lmpObj, submittedCalculationDate) {
    let calculationDateObject = getDateObjFromEnteredDate(submittedCalculationDate);
    let lmpObjMilliseconds = lmpObj.getTime();
    let calculationDateMilliseconds = calculationDateObject.getTime();
    let gestationalAgeMilliseconds = calculationDateMilliseconds - lmpObjMilliseconds;
    let gestationalAgeTotalDays = Math.round(gestationalAgeMilliseconds / (1000 * 60 * 60 * 24))
    let gestationalWeeks = Math.floor(gestationalAgeTotalDays / 7);
    let gestationalDays = Math.floor(gestationalAgeTotalDays % 7);
    return [gestationalWeeks, gestationalDays];
  }

  // Calculate LMP given conception date and return a date object for LMP.
  function getLmpObjFromConceptionDateObj(conceptionDateObj) {
    let conceptionMilliseconds = conceptionDateObj.getTime();
    let lmpMilliseconds = conceptionMilliseconds - lmpToConception;
    let constructorMilliseconds = lmpMilliseconds + tmzOffset;
    let lmpObj = new Date(constructorMilliseconds);
    return lmpObj;
  }

  // Calculate LMP given EDD and return a date object for LMP.
  function getLmpObjFromEddDateObj(eddDateObj) {
    let eddMilliseconds = eddDateObj.getTime();
    let lmpMilliseconds = eddMilliseconds - lmpToEdd;
    let constructorMilliseconds = lmpMilliseconds + tmzOffset;
    let lmpObj = new Date(constructorMilliseconds);
    return lmpObj;
  }

  // Calculate LMP given gestational age and a calculation date and return a date object for LMP.
  function getLmpObjectFromGestationalDaysTotalAndSubmittedCalculationDate(gestationalDaysTotal, submittedCalculationDate) {
    let gestationalAgeMilliseconds = gestationalDaysTotal * (1000 * 60 * 60 * 24)
    let calculationDateObject = getDateObjFromEnteredDate(calculationDate); // should this be submitted calculation date
//    let calculationDateObject = new Date(calculationDate);
    let calculationDateMilliseconds = calculationDateObject.getTime();
    let lmpMilliseconds = calculationDateMilliseconds - gestationalAgeMilliseconds;
    let constructorMilliseconds = lmpMilliseconds + tmzOffset;
    let lmpObject = new Date(constructorMilliseconds);
    return lmpObject;
  }

  // Translate a date object into years, days, hours, minutes, and seconds.
  // Used for comparing Date object functions and debugging timezone issues.
  function translateMilliseconds(timeObj) {
    let minute = 1000 * 60;
    let hour = minute * 60;
    let day = hour * 24
    let year = day * 365
    let newDateObj = new Date(timeObj); // new Date Obj has local info
    let years = Math.floor(timeObj/year);
    timeObj = timeObj - (years * year)
    let days = Math.floor(timeObj/day)
    timeObj = timeObj - (days * day)
    let hours = Math.floor(timeObj/hour)
    timeObj = timeObj - (hours * hour)
    let minutes = Math.floor(timeObj/minute)
    timeObj = timeObj - (minute * minutes);
    let seconds = Math.floor(timeObj/1000);
    timeObj = timeObj - (seconds * 1000);
    console.log("years: " + years)
    console.log("days: " + days)
    console.log("hourrs: " + hours)
    console.log("minutes: " + minutes)
    console.log("seconds: " + seconds)
  }

  // Translate an entered date into a UTC date object.
  function getDateObjFromEnteredDate(enteredDate) {
    let year = parseInt(enteredDate.slice(0, 4));
    let month = parseInt(enteredDate.slice(5, 7)) -1;
    let day = parseInt(enteredDate.slice(8, 10));
    let dateObj = new Date(Date.UTC(year, month, day));
    let dateMilliseconds = dateObj.getTime()
    let constructorMilliseconds = dateMilliseconds + tmzOffset;
    let newDateObj = new Date(constructorMilliseconds);
    return newDateObj;
  }

  // Show the feedback message after sumission.
  function showMessage(color, message) {
    document.getElementById("messageElement").innerHTML = message;
    document.getElementById("messageElement").style.color = color;
    document.getElementById("messageElement").style.fontSize = "1.1em";
    document.getElementById("messageElement").style.visibility = "visible";
  }

}, false);
