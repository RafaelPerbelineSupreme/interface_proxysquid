import React, { Component } from "react";
// import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.min.css';
import Spinner from 'react-bootstrap/Spinner'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

class SpinnerJs extends Component {
      state = {loading: false,
                sucesso: true,
                isClose: true,
                message: ''
              };

    onConfirm = () => {
       setTimeout(
            1000
        )
        this.setState({
            isClose: true,
        })
    }

     fetchData = async() => {
     this.setState({ loading: true });
       return fetch(this.props.api, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => res.json())
      .then(res => {
      toast.success(res);
         this.setState({
                sucesso: true,
                isClose: false,
                message: res,
                loading: false
            });
      })
      .catch((err) => {

      })
    }

  render() {
    const { loading } = this.state;
    return (
        <button style={this.props.style} onClick={this.fetchData} disabled={loading}>
            {
            (this.state.sucesso === true && this.state.isClose === false)
              ?
                <div> </div>
              :
                <div> </div>
          }
           {loading && (
             <Spinner style={{ marginRight: "5px" }}
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />
          )}
          {loading &&  'Aguarde...'}
          {!loading && <div><i class={this.props.icon}></i> {this.props.title}</div>}
        </button>
    );
  }
}

export default SpinnerJs;