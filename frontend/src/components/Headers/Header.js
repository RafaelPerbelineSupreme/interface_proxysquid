/*!

=========================================================
* Argon Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/argon-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/argon-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import React, { useState, useEffect, useReducer } from "react";
// reactstrap components
import { Card, CardBody, CardTitle, Container, Row, Col, FormGroup, Label, Input } from "reactstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NavbarPage from '../Navbars/MaterialNavbar';
import { getProducts } from '../../api/apiProduct';
import {Tabs, Tab} from 'react-bootstrap-tabs';
import Clock from './Clock';
import { Multiselect } from 'multiselect-react-dropdown';
import SpinnerJs from './Spinner';

const Header = () => {
    //https://www.npmjs.com/package/multiselect-react-dropdown
    const [site, setSite] = useState([]);
    const [siteBloqueado, setSiteBloqueado] = useState('teste');
    const [diasSemana, setDiasSemana] = useState('');
    const [meuIp, setMeuIp] = useState('');
    const [options, setOptions] = useState([
        {name: 'Domingo', abreviacao: 'S'},
        {name: 'Segunda-feira', abreviacao: 'M'},
        {name: 'Terça-feira', abreviacao: 'T'},
        {name: 'Quarta-feira', abreviacao: 'W'},
        {name: 'Quinta-feira', abreviacao: 'H'},
        {name: 'Sexta-feira', abreviacao: 'F'},
        {name: 'Sábado', abreviacao: 'A'},
    ])

    function sleep(time){
      return new Promise((resolve)=>setTimeout(resolve,time)
    )
}

    useEffect(() => {
       getProducts().then(data => {
            setSite(data.site)
        });

       whatIsMyIp();
    }, []);

    const bloquearSite = async(e) => {
      return fetch("http://127.0.0.1:8000/api/blockurl/", {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ site: siteBloqueado, semana: diasSemana.toString().replace(',', '') })
      })
      .then(res => res.json())
      .then(res => {
        toast.success(res);
        sleep(1500).then(()=>{
           window.location.reload(false);
        })
      })
      .catch((err) => {
        toast.error(`${siteBloqueado} já se encontra na Blacklist`);
      });
    }

    const desbloquearSite = async site => {
       return fetch("http://127.0.0.1:8000/api/removeurl/", {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: site.id, site: site.site })
      })
      .then(res => res.json())
      .then(res => {
        toast.success(res);
        sleep(1500).then(()=>{
           window.location.reload(false);
        })
      })
      .catch((err) => {
        toast.error(`${siteBloqueado} já se encontra na Blacklist`);
      })
    }

    const whatIsMyIp = async() => {
       return fetch("http://127.0.0.1:8000/api/whatismyip/", {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
      .then(res => res.json())
      .then(res => {
        setMeuIp(res);
      })
      .catch((err) => {
           toast.error(err);
      })
    }

    const onSelect = (selectedList, selectedItem) => {
        setDiasSemana([...diasSemana, selectedItem.abreviacao]);
    }

    //console.log(diasSemana.toString().replace(',', ''))
    return (
            <>
        <div style={{backgroundColor: 'deepskyblue'}} className="header pb-8 pt-5 pt-md-8">
          <Container fluid>
            <br/>
            <Row>
            <Col className="col-sm-8 center">
                <img style={{display: 'block', marginLeft: 'auto', marginRight: 'auto'}} src="https://schwaighofer.sytes.net/wp-content/uploads/2019/09/DXxSP7SVAAAnArQ.png" height="100px"/>
                <p style={{color: 'white', fontSize: '50px', marginTop: '20px', marginBottom: '20px', textAlign: 'center'}}>Web Interface for Squid Proxy Server</p>
                <Card className="card-stats mb-3 mb-xl-0" >
                <CardBody style={{borderRadius: '45px'}} >
            <Tabs onSelect={(index, label) => console.log(label)}>
                <Tab label={<span><img height="25px" src="https://cdn0.iconfinder.com/data/icons/kameleon-free-pack-rounded/110/Settings-5-512.png"/> Configurar</span>}>
                <Card className="card-stats mb-3 mb-xl-0" >
                <CardBody style={{borderRadius: '45px'}} >
                    <br />
                    <p>Instalar o Squid Proxy Server</p>
                    <input type="text" value="sudo apt install squid -y" id="meuip" name="ip" disabled />
                    <br /><br />
                    <p>Desinstalar o Squid Proxy Server</p>
                    <input type="text" value="sudo apt purge squid -y" id="meuip" name="ip" disabled />
                    <br />
                    <br />
                    <p>Ip da máquina</p>
                     <input type="text" value={meuIp} id="meuip" name="ip" disabled />
                    <br />
                        <SpinnerJs title="Instalar o Squid Proxy Server" icon="fas fa-check-double" api="http://127.0.0.1:8000/api/installsquid/" style={
                        {
                        cursor: "pointer",
                        bottom: "28px",
                        height: "35px",
                        background: "deepskyblue",
                        color: "white",
                        borderRadius: "4px",
                        borderColor: "deepskyblue",
                        border: "1px solid deepskyblue",
                        fontWeight: "700",
                        fontSize: ".8em",
                        marginLeft: '10px',
                        marginTop: '40px',
                        marginBottom: '1px'
                        }
                    }/>
                        <SpinnerJs title="Configurar Proxy" icon="fas fa-cogs" api="http://127.0.0.1:8000/api/configuresquid/" style={
                        {
                        cursor: "pointer",
                        bottom: "28px",
                        height: "35px",
                        background: "deepskyblue",
                        color: "white",
                        borderRadius: "4px",
                        borderColor: "deepskyblue",
                        border: "1px solid deepskyblue",
                        fontWeight: "700",
                        fontSize: ".8em",
                        marginLeft: '10px',
                        marginTop: '40px',
                        marginBottom: '1px'
                        }
                    }/>

                       <SpinnerJs title="Desinstalar o Squid Proxy Server" icon="fas fa-cogs" api="http://127.0.0.1:8000/api/uninstallsquid/" style={
                        {
                        cursor: "pointer",
                        bottom: "28px",
                        height: "35px",
                        background: "deepskyblue",
                        color: "white",
                        borderRadius: "4px",
                        borderColor: "deepskyblue",
                        border: "1px solid deepskyblue",
                        fontWeight: "700",
                        fontSize: ".8em",
                        marginLeft: '10px',
                        marginTop: '40px',
                        marginBottom: '1px'
                        }
                    }/>

                </CardBody>
                </Card>
                </Tab>
                <Tab label={<span><img height="20x" src="https://cdn4.iconfinder.com/data/icons/social-messaging-ui-coloricon-1/21/55-512.png"/> Bloquear</span>}>
                    <Card className="card-stats mb-3 mb-xl-0" >
                <CardBody style={{borderRadius: '45px'}} >
                      <FormGroup row>
                       <p style={{marginTop: '10px'}}>Nome do site</p>
                        <Col sm={4}>
                          <Input onChange={(e) => setSiteBloqueado(e.target.value.replace(/\s/g,'').toLowerCase())} type="text" name="site" id="site" placeholder="Nome do site a ser bloqueado" />
                        </Col>
                      </FormGroup>
                      <FormGroup row>
                        <p style={{marginTop: '10px'}}>Dias da semana?</p>
                        <Col sm={4}>
                        <Multiselect
                        options={options} // Options to display in the dropdown
                        //selectedValues={selectDiasSemana} // Preselected value to persist in dropdown
                        onSelect={onSelect} // Function will trigger on select event
                        displayValue="name" // Property name to display in the dropdown options
                        />
                        </Col>
                          <button
                        style={{
                        cursor: "pointer",
                        bottom: "28px",
                        height: "35px",
                        background: "deepskyblue",
                        color: "white",
                        borderRadius: "4px",
                        borderColor: "deepskyblue",
                        border: "1px solid deepskyblue",
                        fontWeight: "700",
                        fontSize: ".8em",
                        marginLeft: '-405px',
                        marginTop: '80px',
                        marginBottom: '1px'
                        }}
                        onClick={bloquearSite}
                        ><i class="far fa-eye"></i>  Bloquear</button>
                      </FormGroup>
                </CardBody>
                </Card>
               </Tab>
                <Tab label={<span><img height="20px" src="https://cdn4.iconfinder.com/data/icons/generic-interaction/143/yes-tick-success-done-complete-check-allow-512.png"/> Desbloquear</span>}>
                <Card className="card-stats mb-3 mb-xl-0" >
                <CardBody style={{borderRadius: '45px'}} >
                    {site.map((site, index) => (<div id="descricao">
                         <p><img style={{marginRight: '10px'}} src="https://cdn6.aptoide.com/imgs/a/0/d/a0daf652b6a0fb16126e8bf495429de3_icon.png" height="30px" alt="unblock" onClick={() => desbloquearSite(site)} /> {site.site}</p>
                    </div>))}
                    <hr/>
                    <p>Quantidade: {site.length}</p>
                </CardBody>
                </Card>
                </Tab>

                <Tab label={<span><img height="25px" src="https://cdn2.iconfinder.com/data/icons/business-271/135/50-512.png"/> Hora Atual</span>}>
                <Card className="card-stats mb-3 mb-xl-0" >
                <CardBody style={{borderRadius: '45px'}} >
                    <br />
                    <Clock />
                    <br />
                </CardBody>
                </Card>
                </Tab>

            </Tabs>
                </CardBody>
                </Card>
            </Col>
            </Row>
            <ToastContainer />
          </Container>   <br/><br/><br/><br/>
        </div>

        </>
    );
}

export default Header;
