fetch("http://localhost:7878/machine", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    msn: "12345",
    machine_type: "TypeA",
    location: "Room 101",
    status: "active",
  }),
})
  .then((response) => response.json())
  .then((data) => console.log(data))
  .catch((error) => console.error("Error:", error));
const appointment = require("../models/appointment");
const Machine = require("../models/machine");

exports.addmachine = (req, res) => {
  const { machine_type, location, status } = req.body;
  const machine = new Machine({
    manufacturing_serial_number: req.body.msn,
    machine_type,
    location,
    status,
  });
  machine
    .save()
    .then(() => {
      res.status(200).json({ message: "Successfully added" });
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.getmachines = async (req, res) => {
  try {
    // Fetch all machines
    const machines = await Machine.find().exec();

    // Group machines by location
    const groupedMachines = machines.reduce((acc, machine) => {
      const { location } = machine;
      if (!acc[location]) {
        acc[location] = [];
      }
      acc[location].push(machine);
      return acc;
    }, {});

    res.json(groupedMachines);
  } catch (error) {
    res.json({ error: error });
  }
};

exports.startmachine = async (req, res) => {
  const msn = req.body.machine_id;
  console.log("Helll" + msn);

  try {
    const machine = await Machine.findById(msn);

    if (machine) {
      const duration =
        new Date(machine.end_time) - new Date(machine.start_time);

      const currentTime = new Date();
      const endTime = new Date(currentTime.getTime() + duration);

      await Machine.findByIdAndUpdate(msn, {
        status: "Occupied",
        start_time: currentTime,
        end_time: endTime,
      }).exec();
      await appointment.findByIdAndUpdate(machine.appointment_id, {
        start_time: currentTime,
        end_time: endTime,
      });
      res.json({ msg: "Started Successfully" });
    } else {
      console.log("Machine not found");
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
