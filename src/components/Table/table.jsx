import React, { useState, useEffect } from 'react'
import { Button,Table,Pagination, PaginationItem, PaginationLink } from 'reactstrap';
import axios from 'axios'
import '../../css/Table.css';
import Loading from './Loading.js'
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import Cookies from 'universal-cookie';
import Moment from 'moment';
const cookies = new Cookies();


const Tables = ({tipoDenuncia}) => {
  
    let URL = 'https://denuncias-api-posadas.herokuapp.com/denuncias'
    
    const[load,setLoad]=useState(false);
    const [denuncias, setDenuncias] = useState([])

    useEffect(() => {
        getData()
    }, [])

    const getData = async () => {
        setLoad(true)
        let options = {
            headers: {
              'Authorization': cookies.get("token")
            }
            };
        const response = await axios.get(URL.concat('?size=650&sort=id,desc'), options)
        
        setDenuncias(tipoDenuncia=='ELEGIR'?response.data._embedded.denuncias:
                                            tipoDenuncia==' '?
                                            response.data._embedded.denuncias:
                                            response.data._embedded.denuncias.filter(d=>d.tipoDenuncia==tipoDenuncia))
        setLoad(false)
        
    }

    const removeData = (id) => {
        let options = {
            headers: {
              'Authorization': cookies.get("token")
            }
            };
        axios.delete(`${URL}/${id}`, options).then(res => {
            const del = denuncias.filter(denuncia => id !== denuncia.id)
            setDenuncias(del)
        })
    }

    const renderHeader = () => {
        let headerElement = ['id', 'motivo', 'fecha','tipoDenuncia','Acción']
        return headerElement.map((key, index) => {
            return <th key={index}>{key.toUpperCase()}</th>
        })
    }

    const renderBody = () => {
        return denuncias && denuncias.map(({ id, motivo, fecha, tipoDenuncia }) => {
            Moment.locale('es');
            return (
                <tr key={id}>
                    <td>{id}</td>
                    <td>{motivo}</td>
                    <td>{ Moment(fecha).format('DD/MM/YYYY') }</td>    
                    <td>{tipoDenuncia}</td>                
                    <td><Button color="danger" onClick={() => removeData(id)}><DeleteForeverIcon/></Button></td>
                </tr>
            )
        })
    }

    return (
        <>   
               
            {load? <Loading/>:
            <Table id='tabla_denuncias' responsive striped>
                <thead>
                    <tr>{renderHeader()}</tr>
                </thead>
                <tbody>
                    {renderBody()}
                </tbody>
            </Table>}
            
        </>
    )
}


export default Tables