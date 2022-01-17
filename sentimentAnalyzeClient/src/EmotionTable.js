import React from 'react';
import './bootstrap.min.css';

class EmotionTable extends React.Component {
    render() {
      //Returns the emotions as an HTML table
      return (  
        <div className="mt-4 col-md-8 offset-md-2 d-flex justify-content-center align-items-center">
          <table className="table table-bordered">
            <tbody>
            {
              /*Write code to use the .map method that you worked on in the 
              Hands-on React lab to extract the emotions. If you are stuck,
              please click the instructions to see how to implement a map*/
                this.props.emotions &&
                Object.entries(this.props.emotions).map(values => {
                    return (
                        <tr>
                            <td>{values[0]}</td>
                            <td>{values[1]}</td>
                        </tr>
                    )
                })
            
            
            }
            </tbody>
          </table>
          </div>
          );
        }
    
}
export default EmotionTable;