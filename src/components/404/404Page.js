import { useDispatch } from "react-redux";
import "./404.css";

import React, { useEffect } from "react";
import { addErrorBoundary } from "../../redux/rtk/features/ErrorBoundary.js/errorBoundarySlice";

const Page404 = (props) => {

  const dispatch = useDispatch()
  const componentStack = props.errorInfo && props.errorInfo.componentStack;

  useEffect(()=>{

    dispatch(addErrorBoundary({error:props.error.message ,errorInfo:componentStack }))
    // console.log('props',props)
  },[addErrorBoundary])

  return (
    <center className="center">
      <section className="page_404">
        <div className="container">
          <div className="row">
            <div className="col-sm-12 ">
              <div className="col-sm-10 col-sm-offset-1  text-center">
                <div className="four_zero_four_bg">
                  {props.hasError ? <h1 className="text-center ">Error </h1> :
                  <h1 className="text-center ">404</h1>}
                  
                </div>

                <div className="contant_box_404">
                  {props?.hasError ? <h3 className="h2">Something Went Wrong!! </h3> : <h3 className="h2">Look like you're lost !</h3>}
                 
                  {/* {console.log('errorInfo',props.errorInfo)} */}
                  {/* {props.errorInfo ? <p>{props.errorInfo} </p>: <p>the page you are looking for not avaible!</p>} */}
                 

                  <a href="/admin/dashboard" className="link_404">
                    Go to Dashboard
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </center>
  );
};

export default Page404;
