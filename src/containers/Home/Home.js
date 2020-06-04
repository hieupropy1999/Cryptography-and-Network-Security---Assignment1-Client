import React, { Component } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
import {Switch} from "../../components/Switch"
class Home extends Component {
  state = {
    formData: null,
    link_to_show: null,
    text_show_file_crypt: ["Choose input files/folder"],
    text_show_file_key: "Choose key file",
    mode: "encrypt",
    algorithms: "aes",
    content_key: false,
    status_decrypt: true,
    isLoading: false,
    isChooseFolder: false,
    time: 0,
    totalSize: 0
  };
  fileChangeHandler = (event) => {
    var value = event.target.files;
    // var value_name = value.length <= 1 ? value[0].name : value.length + " files are chosen";
    var value_name = [];
    var totalSize = 0;
    for (var j = 0; j < value.length; j++) {
      value_name.push(value[j].name);
      // console.log(value[j].size);
      totalSize += value[j].size;
    }

    var formData;
    if (this.state.formData && this.state.content_key) {
      formData = this.state.formData;
      formData.delete("file_to_encrypt");
      this.setState({
        totalSize: 0
      });
    } else {
      formData = new FormData();
    }

    for (var i = 0; i < value.length; i++) {
      formData.append("file_to_encrypt", value[i]);
    }
    this.setState({
      formData: formData,
      text_show_file_crypt: value_name,
      totalSize: (totalSize / 1024).toFixed(2)
    });
    // console.log(formData.length);
  };

  keyFileChangeHandler = (event) => {
    var value = event.target.files[0];
    // console.log(value);
    if (value && value.type !== "text/plain") {
      alert("Key key must be text file");
      document.getElementById("key").value = "";
      return;
    }
    if (!this.state.formData) {
      this.setState({
        formData: new FormData(),
      });
    }
    let reader = new FileReader();
    reader.onload = (event) => {
      var formData = this.state.formData;
      formData.delete("content_key");
      formData.append("content_key", event.target.result);
      //add algorithms to formData
      if (formData.has("algorithms")) {
        formData.delete("algorithms");
        formData.append("algorithms", this.state.algorithms);
      } else {
        formData.append("algorithms", this.state.algorithms);
      }
      this.setState({
        formData: formData,
        text_show_file_key: value.name,
        content_key: true,
      });
    };
    if (value) {
      reader.readAsText(value);
    }
  };
  typeChangeHandler = (event) => {
    const value = event.target.value;
    const name = event.target.name;
    this.setState({
      [name]: value,
    });
  };
  algorithmsChangeHandler = (event) => {
    var formData = this.state.formData;
    if (formData) {
      if (formData.has("algorithms")) {
        formData.delete("algorithms");
        formData.append("algorithms", event.target.value);
      } else {
        formData.append("algorithms", event.target.value);
      }
    }
    this.setState({
      algorithms: event.target.value,
    });
  };
  isShowPathToView = () => {
    if (this.state.link_to_show && this.state.status_decrypt) {
      return (
        <div className="showPathToView">
          <h3>The path to current result:</h3>
          <p>{this.state.link_to_show}</p>
          <p>{`Time to complete : ${this.state.time} milliseconds.` }</p>
          <p>{`Total size of sended file : ${this.state.totalSize} KB.`}</p>
        </div>
      );
    } else if (this.state.link_to_show && !this.state.status_decrypt) {
      return (
        <div className="showPathToView">
          <h3>Error</h3>
          <p>{this.state.link_to_show}</p>
          <p>{`Time to complete : ${this.state.time} milliseconds.` }</p>
          <p>{`Total size of sended file : ${this.state.totalSize} KB`}</p>
        </div>
      );
    }
  };
  switchHandler = (event) =>{
    this.setState({
      isChooseFolder: event.target.checked
    });
  }
  submitHandler = (event) => {
    event.preventDefault();
    var t0 = performance.now();
    this.setState({
      isLoading: true,
    });
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post(`/${this.state.mode}`, this.state.formData, config)
      .then((response) => {
        var newPath = response.data.split("\\");
        // console.log(response.data);
        if (newPath.length === 1) {
          this.setState({
            link_to_show: newPath[0],
            status_decrypt: false,
            isLoading: false,
          });
        } else {
          var result_path = "";
          for (var i = 0; i < newPath.length - 2; i++) {
            result_path += newPath[i] + "/";
          }
          result_path += newPath[newPath.length - 2];
          this.setState({
            link_to_show: result_path,
            isLoading: false,
            isChooseFolder: false
          });
        }
        var t1 = performance.now();
        this.setState({
          time: (t1 - t0).toFixed(2)
        })
        // console.log(`Time to ${this.state.mode} :`, t1 - t0 + " milliseconds.");
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false,
          isChooseFolder: false
        })
      });
  };
  resetHandler = () => {
    this.setState({
      formData: null,
      link_to_show: null,
      text_show_file_crypt: ["Choose input files/folder"],
      text_show_file_key: "Choose key file",
      mode: "encrypt",
      algorithms: "aes",
      content_key: false,
      status_decrypt: true,
      isLoading: false,
      isChooseFolder: false,
    });
  };
  render() {
    return (
      <div className="container">
        <h1 className="text-primary text-center">Encrypt-Decrypt</h1>
        <form onSubmit={this.submitHandler} encType="multipart/form-data">
          <div className="form-group">
            <label htmlFor="mode">Select Mode</label>
            <select
              className="form-control wrapFile"
              id="mode"
              name="mode"
              onChange={this.typeChangeHandler}
            >
              <option value="encrypt">Encrypt</option>
              <option value="decrypt">Decrypt</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="algorithms">Select Algorithms</label>
            <select
              className="form-control wrapFile"
              id="algorithms"
              name="algorithms"
              onChange={this.algorithmsChangeHandler}
            >
              <option value="aes">AES</option>
              <option value="rsa">RSA</option>
            </select>
          </div>
          <div className="wrapFile mt-3" style={{position: "relative"}}>
            <div className="textFile">
              {this.state.text_show_file_crypt.map((value, key) => {
                return (
                  <p className="m-0" key={key}>
                    {value}
                  </p>
                );
              })}
            </div>
            <Switch isON = {this.state.isChooseFolder} changed = {this.switchHandler}/>
            <label className="labelFile" htmlFor="input">
              {" "}
              <i className="fas fa-paperclip"></i>
            </label>
            {this.state.isChooseFolder ? (
              <input
                // multiple
                directory=""
                webkitdirectory=""
                onChange={this.fileChangeHandler}
                type="file"
                name="file_to_encrypt"
                className="form-control d-none"
                id="input"
                required
              />
            ) : (
              <input
                multiple
                onChange={this.fileChangeHandler}
                type="file"
                name="file_to_encrypt"
                className="form-control d-none"
                id="input"
                required
              />
            )}
          </div>
          <div className=" wrapFile mt-3">
            <span className="textFile">{this.state.text_show_file_key}</span>
            <label className="labelFile" htmlFor="key">
              <i className="fas fa-paperclip" aria-hidden="true"></i>
            </label>
            <input
              onChange={this.keyFileChangeHandler}
              type="file"
              name="file_key"
              className="form-control d-none"
              id="key"
              required
            />
          </div>
          <div className="d-flex justify-content-center mt-3">
            <input
              type="submit"
              value={this.state.mode === "encrypt" ? "Encrypt" : "Decrypt"}
              className="btn btn-primary mr-3"
              disabled={!this.state.formData || !this.state.content_key}
              id="submit-button"
            />
            <input
              onClick={this.resetHandler}
              type="reset"
              className="btn btn-danger ml-3"
              value="Reset"
            />
          </div>
        </form>
        {this.state.isLoading ? <Spinner /> : ""}
        {this.isShowPathToView()}
      </div>
    );
  }
}
export default Home;
