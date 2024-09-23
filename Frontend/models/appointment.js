class Appointment {
  constructor(
    patientID,
    machineId,
    notes,
    startTime,
    duration,
    type = "Regular"
  ) {
    this.patientID = patientID;
    this.machineId = machineId;
    this.notes = notes;
    this.startTime = startTime;
    this.duration = duration;
    this.endTime = new Date(startTime.getTime() + duration * 60000);
    this.type = type;
  }
}

export default Appointment;
