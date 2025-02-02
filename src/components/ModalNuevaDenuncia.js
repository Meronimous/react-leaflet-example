import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React from 'react';
import { Button, FormGroup, Input, Label, Modal, ModalBody, ModalFooter, ModalHeader, Tooltip } from 'reactstrap';
import Cookies from 'universal-cookie';
const cookies = new Cookies();

class ModalNuevaDenuncia extends React.Component {
    constructor(props) {


        super(props);
        this.state = {
            modal: props.initialModalState,
            fade: true,
            motivo: "",
            tipoDenuncia: "",
            nombre: "",
            apellido: "",
            dni: "",
            lat: props.lat,
            lon: props.lon,
            toolTip:false

        };
        

        this.toggle = this.toggle.bind(this);
        this.toggleTool = this.toggleTool.bind(this);
        
    }

   
    

    changeHandler = e => {
        this.setState({ [e.target.name]: e.target.value })     
          
    }
    submitHandler = e => {
        const persona = ({
            nombre: null,
            apellido: null,
            dni: null,
            sexo: null,
            fechaNacimiento: null

        })
        const ubicacion = ({
            lat: this.state.lat,
            lon: this.state.lon
        })
        const judicial = ({
            id: null
        })

        const denuncia = ({
            motivo: this.state.motivo,
            fecha: new Date(),
            tipoDenuncia: this.state.tipoDenuncia,
            lat:this.state.lat,
            lon:this.state.lon,
            ubicacion: ubicacion,
            denunciado: persona,
            denunciante: persona,
            judicial: judicial

        })
        const myObjStr = JSON.stringify(denuncia);
        e.preventDefault()




        axios
            .post('https://denuncias-api-posadas.herokuapp.com/denuncias', myObjStr, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': cookies.get("token")
                }
            })
            .then(response => {
                console.log(response)
                this.toggle();
            })
            .catch(error => {
                console.log(myObjStr)
                console.log(error)
            })
    }

    

    toggle() {
       
        this.setState({
            modal: !this.state.modal,
            fade: !this.state.fade,
            

        });
    }

    toggleTool() {
       
        this.setState({
            
            toolTip: !this.state.toolTip

        });
    }

    

    render() {
        return (
            <div>
                
                <Button id='nuevaDenuncia' color="danger" onClick={this.toggle}><FontAwesomeIcon icon={faPlus} size="1x" /></Button>
                <Tooltip placement="right" isOpen={this.state.toolTip} target="nuevaDenuncia" toggle={this.toggleTool}>
                    NUEVA DENUNCIA
                </Tooltip>
                
                <Modal isOpen={this.state.modal} toggle={this.toggle}
                    fade={this.state.fade}
                    className={this.props.className} >
                    <form onSubmit={this.submitHandler}>
                        <ModalHeader toggle={this.toggle}>NUEVA DENUNCIA</ModalHeader>
                        <ModalBody>
                            <FormGroup>
                                <Label for="motivo">Motivo</Label>
                                <Input type="text" id="motivo" name="motivo" onChange={this.changeHandler} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="tipoDenuncia">Tipo Denuncia</Label>
                                <div>
                                <select  id="lang" className="select" name="tipoDenuncia" onChange={this.changeHandler} value={this.state.value}>
                                    <option value="ELEGIR">ELEGIR</option>
                                    <option value="VIOLENCIA_DE_GENERO">VIOLENCIA_DE_GENERO</option>
                                    <option value="ROBO">ROBO</option>
                                    <option value="NARCOTRAFICO">NARCOTRAFICO</option>
                                    <option value="HOMICIDIO">HOMICIDIO</option>
                                    <option value="FEMICIDIO">FEMICIDIO</option>
                                    <option value="PARRICIDIO">PARRICIDIO</option>
                                </select>
                                </div>
                            </FormGroup>
                            <FormGroup>
                                <Label for="nombre">Nombre</Label>
                                <Input type="text" id="nombre" name="nombre" onChange={this.changeHandler} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="apellido">Apellido</Label>
                                <Input type="text" id="apellido" name="apellido" onChange={this.changeHandler} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="dni">Dni</Label>
                                <Input type="text" id="dni" name="dni" onChange={this.changeHandler} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="latitud">Latitud</Label>
                                <Input type="number" id="latitud" name="lat" value={this.state.lat} onChange={this.changeHandler} />
                            </FormGroup>
                            <FormGroup>
                                <Label for="longitud">Longitud</Label>
                                <Input type="number" id="longitud" name="lon" value={this.state.lon} onChange={this.changeHandler} />
                            </FormGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="primary" onClick={this.submitHandler}>CREAR</Button>{' '}
                            <Button color="secondary" onClick={this.toggle}>CANCELAR</Button>
                        </ModalFooter>
                    </form>
                </Modal>
            </div>
        );
    }
}

export default ModalNuevaDenuncia;

