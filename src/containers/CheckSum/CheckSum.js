import React, { Component } from "react";
import axios from "axios";
import Spinner from "../../components/Spinner";
class CheckSum extends Component {
  state = {
    // formData: null,
    text_show_original_file: "Choose the original file",
    text_show_decrypt_file: "Choose the decrypt file",
    original_file: null,
    decrypt_file: null,
    isLoading: false,
    hash_original: "Please choose files and click compare",
    hash_decrypt: "Please choose files and click compare",
    result: false,
    isFinish: false,
    mode: "sha256",
    time: 0,
  };

  originalFileChangeHandler = (event) => {
    var value = event.target.files[0];
    this.setState({
      text_show_original_file: value.name,
      original_file: value,
    });
  };
  decryptFileChangeHandler = (event) => {
    var value = event.target.files[0];
    this.setState({
      text_show_decrypt_file: value.name,
      decrypt_file: value,
    });
  };
  modeChangeHandler = (event) => {
    this.setState({
      mode: event.target.value,
    });
  };
  submitHandler = (event) => {
    event.preventDefault();
    var t0 = performance.now();
    let { original_file, decrypt_file, mode } = this.state;
    var formData;
    formData = new FormData();
    formData.append("file_check", original_file);
    formData.append("file_check", decrypt_file);
    formData.append("mode_hash", mode);
    this.setState({
      isLoading: true,
    });
    const config = {
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    axios
      .post("/check", formData, config)
      .then((response) => {
        // console.log(response.data);
        // console.log("Time to do : ", t1 - t0 + " milliseconds.");
        this.setState({
          isLoading: false,
          // formData: null
          hash_original: response.data.hashValue[0],
          hash_decrypt: response.data.hashValue[1],
          result: response.data.compareResult,
          isFinish: true,
        });
        var t1 = performance.now();
        this.setState({
          time: (t1 - t0).toFixed(2)
        })
      })
      .catch((error) => {
        console.log(error);
        this.setState({
          isLoading: false,
          isFinish: true,
        });
      });
  };

  resetHandler = () => {
    this.setState({
      formData: null,
      text_show_original_file: "Choose the original file",
      text_show_decrypt_file: "Choose the decrypt file",
      isLoading: false,
      hash_original: "Please choose files and click compare",
      hash_decrypt: "Please choose files and click compare",
      isFinish: false,
      time: 0
    });
  };
  render() {
    return (
      <div className="container">
        <h1 className="text-primary text-center">Verify files</h1>
        <form onSubmit={this.submitHandler} encType="multipart/form-data">
          <div className=" wrapFile mt-3">
            <span className="textFile">
              {this.state.text_show_original_file}
            </span>
            <label className="labelFile" htmlFor="original_file">
              <i className="fas fa-paperclip" aria-hidden="true"></i>
            </label>
            <input
              onChange={this.originalFileChangeHandler}
              type="file"
              name="text_show_original_file"
              className="form-control d-none"
              id="original_file"
              required
            />
          </div>
          <div className=" wrapFile mt-3">
            <span className="textFile">
              {this.state.text_show_decrypt_file}
            </span>
            <label className="labelFile" htmlFor="decrypt_file">
              <i className="fas fa-paperclip" aria-hidden="true"></i>
            </label>
            <input
              onChange={this.decryptFileChangeHandler}
              type="file"
              name="text_show_decrypt_file"
              className="form-control d-none"
              id="decrypt_file"
              required
            />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="mode">Select Hash Function</label>
            <select
              className="form-control wrapFile"
              id="mode"
              name="mode"
              onChange={this.modeChangeHandler}
            >
              <option value="sha256">SHA256</option>
              <option value="sha512">SHA512</option>
              <option value="md5">MD5</option>
            </select>
          </div>
          <div className="form-group mt-3" hidden={!this.state.isFinish}>
            <label htmlFor="original">Hash value of original file</label>
            <textarea
              rows={2}
              className="form-control wrapFile"
              id="original"
              name="hash_original"
              value={this.state.hash_original}
              readOnly
            />
          </div>
          <div className="form-group mt-3" hidden={!this.state.isFinish}>
            <label htmlFor="decrypt">Hash value of decrypt file</label>
            <textarea
              rows={2}
              className="form-control wrapFile"
              id="decrypt"
              name="hash_decrypt"
              value={this.state.hash_decrypt}
              readOnly
            />
          </div>
          <div className="form-group mt-3" hidden={!this.state.isFinish}>
            <label htmlFor="result">Result Check</label>
            <input
              className="form-control wrapFile"
              id="result"
              name="result"
              value={
                this.state.result
                  ? "The files are correct"
                  : "The files are not correct"
              }
              readOnly
            />
          </div>

          <div className="d-flex justify-content-center mt-3">
            <input
              type="submit"
              value="Compare"
              className="btn btn-primary mr-3"
              id="submit-button"
              disabled={!this.state.decrypt_file || !this.state.original_file}
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
        {this.state.isFinish ? (
          <div className="showPathToView">
            <p>{`Time to complete : ${this.state.time} milliseconds.`}</p>
          </div>
        ) : (
          ""
        )}
      </div>
    );
  }
}
export default CheckSum;
