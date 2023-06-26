import React, { Component } from "react";
import { Button, TextField } from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

class AddTodo extends Component {
  constructor() {
    super();
    this.state = {
      content: "",
      date: null
    };
  }

  handleChange = (event) => {
    this.setState({
      content: event.target.value,
      date: new Date(event).toLocaleDateString()
    });
  };

  handleDateChange = (date) => {
    this.setState({
      date: date.toLocaleDateString()
    });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    if (this.state.content.trim()) {
      this.props.addTodo(this.state);
      this.setState({
        content: "",
        date: null
      });
    }
  };

  render() {
    return (
      <div>
        <TextField
          label="Add New Item"
          variant="outlined"
          onChange={this.handleChange}
          value={this.state.content}
        />
        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <DesktopDatePicker
            id="new-item-date"
            label="Due Date"
            value={this.state.date}
            onChange={this.handleDateChange}
            renderInput={(params) => (
              <TextField
                {...params}
                inputProps={{ readOnly: true }}
              />
            )}
          />
        </LocalizationProvider>
        <Button
          style={{ marginLeft: "10px" }}
          onClick={this.handleSubmit}
          variant="contained"
          color="primary"
        >
          Add
        </Button>
      </div>
    );
  }
}

export default AddTodo;
