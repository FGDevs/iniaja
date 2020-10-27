import React, { createRef } from 'react';
import { API_URL } from '../helpers';
import Axios from 'axios';

class Home extends React.Component{
    state = {
        nama:createRef(),
        usia:createRef(),
        pekerjaan:createRef(),
        users:[],
        indexedit:-1,
        editnama:createRef(),
        editusia:createRef(),
        editpekerjaan:createRef(),
        filterpekerjaan:[]
    };

    componentDidMount() {
        Axios.get(`${API_URL}/users`)
        .then((result)=>{
            let filterpekerjaan=[]
            result.data.forEach((val)=>{
                filterpekerjaan.push({pekerjaan:val.pekerjaan})
            })
            // console.log(filterpekerjaan)
            this.setState({users:result.data,filterpekerjaan})
        }).catch((error)=>{
            console.log(error)
        })
    }

    onAddData=()=>{
        let obj = {
            nama : this.state.nama.current.value,
            usia : this.state.usia.current.value,
            pekerjaan : this.state.pekerjaan.current.value  
        }
       
        Axios.post(`${API_URL}/users`,obj)
        .then(()=>{
            Axios.get(`${API_URL}/users`)
            .then((result)=>{
                let filterpekerjaan=[{pekerjaan:[]}]
                result.data.forEach((val)=>{
                    filterpekerjaan.push({pekerjaan:val.pekerjaan})
                })
                this.setState({users:result.data,filterpekerjaan})
            }).catch((error)=>{
                console.log(error)
            })
        }).catch((error)=>{
            console.log(error);
        })
    }

    onEditUserClick=(index)=>{
        this.setState({indexedit:index})
    }    
    
    onEditCancelClick=()=>{
        this.setState({indexedit:-1})
    }

    onEditSaveClick=(id)=>{
        let obj = {
            nama : this.state.editnama.current.value,
            usia : this.state.editusia.current.value,
            pekerjaan : this.state.editpekerjaan.current.value  
        }
        Axios.patch(`${API_URL}/users/${id}`,obj)
        .then(()=>{
            Axios.get(`${API_URL}/users`)
            .then((result)=>{
                let filterpekerjaan=[]
                result.data.forEach((val)=>{
                    filterpekerjaan.push({pekerjaan:val.pekerjaan})
                })
                this.setState({
                    users:result.data,
                    indexedit:-1,
                    filterpekerjaan
                })
            }).catch((error)=>{
                console.log(error)
            })
        }).catch((error)=>{
            console.log(error)
        })
    }

    onDeleteUserClick=(index)=>{
        let confirm = window.confirm(`Beneran mau hapus data ${this.state.users[index].nama} ?`)
        if (confirm) {
            Axios.delete(`${API_URL}/users/${this.state.users[index].id}`)
            .then(()=>{
                Axios.get(`${API_URL}/users`)
                .then((result)=>{
                    let filterpekerjaan=[]
                    result.data.forEach((val)=>{
                        filterpekerjaan.push({pekerjaan:val.pekerjaan})
                    })
                    this.setState({users:result.data,filterpekerjaan})
                }).catch((error)=>{
                    console.log(error)
                })
            }).catch((error)=>{
                console.log(error)
            })
        }
    }

    onDeleteAllData=()=>{
        let confirm = window.confirm(`Beneran mau hapus SEMUA data?`)
        if (confirm) {
            let deletearr=[]
            this.state.users.forEach((val)=>{
                deletearr.push(Axios.delete(`${API_URL}/users/${val.id}`))
            })
            console.log(deletearr)
            Axios.all(deletearr)
            .then(()=>{
                Axios.get(`${API_URL}/users`)
                .then((result)=>{
                    this.setState({users:result.data})
                }).catch((error)=>{
                    console.log(error)
                })
            }).catch((error)=>{
                console.log(error)
            })
        }
    }

    onChangeFilter=(e)=>{
        // console.log(e.target.value)
        if(e.target.value==="Filter By Pekerjaan"){
            console.log('test')
            Axios.get(`${API_URL}/users`)
            .then((result)=>{
                console.log(result.data)
                let filterpekerjaan=[]
                result.data.forEach((val)=>{
                    filterpekerjaan.push({pekerjaan:val.pekerjaan})
                })
                this.setState({users:result.data,filterpekerjaan})
            }).catch((error)=>{
                console.log(error)
            })
        }else{
            Axios.get(`${API_URL}/users`,{
                params:{
                    pekerjaan:e.target.value
                }
            }).then((result)=>{
                this.setState({users:result.data})
            }).catch((error)=>{
                console.log(error)
            })
        }
    }

    renderOptions=()=>{
        return this.state.filterpekerjaan.map((val)=>{
            return (
                <option>{val.pekerjaan}</option>
            )
        })
    }

    renderUsers=()=>{
        return this.state.users.map((val,index)=>{
            // console.log(val)
            if(index===this.state.indexedit){
                return (
                    <tr className='row' key={index}>
                        <td className='col-md-3'><input defaultValue={val.nama} ref={this.state.editnama}/></td>
                        <td className='col-md-3'><input defaultValue={val.usia} ref={this.state.editusia}/></td>
                        <td className='col-md-3'><input defaultValue={val.pekerjaan} ref={this.state.editpekerjaan}/></td>
                        <td className='col-md-3 text-center'>
                            <input type="button" className='btn btn-primary mr-2' value="save" onClick={()=>this.onEditSaveClick(val.id)}/>
                            <input type="button" className='btn btn-primary mr-2' value="cancel" onClick={()=>this.onEditCancelClick()}/>
                        </td>
                    </tr>
                )
            }
            return (
                <tr className='row' key={index}>
                    <td className='col-md-3'>{val.nama}</td>
                    <td className='col-md-3'>{val.usia}</td>
                    <td className='col-md-3'>{val.pekerjaan}</td>
                    <td className='col-md-3 text-center'>
                        <input type="button" className='btn btn-secondary mr-2' value="edit" onClick={()=>this.onEditUserClick(index)}/>
                        <input type="button" className='btn btn-danger' value="hapus" onClick={()=>this.onDeleteUserClick(index)}/>
                    </td>
                </tr>
            )
        })
    }

    render(){
        // console.log(this.state.users)
        // console.log(this.state.filterpekerjaan)
        return(
            <div>
                <h1>SOAL 1</h1>
                <div className='row'>
                    <div className='col-md-4 mb-4'>
                        <select className='form-control' onChange={(e)=>this.onChangeFilter(e)}>
                            <option>Filter By Pekerjaan</option>
                            {this.renderOptions()}
                        </select>
                    </div>
                </div>
                <table className='table mb-4'>
                    <thead>
                        <tr className='row' >
                            <td className='col-md-3 text-center'>Nama</td>
                            <td className='col-md-3 text-center'>Usia</td>
                            <td className='col-md-3 text-center'>Pekerjaan</td>
                            <td className='col-md-3 text-center'>Act</td>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderUsers()}
                    </tbody>
                </table>
                <div className='row'>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Nama' ref={this.state.nama}/> </div>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Usia' ref={this.state.usia}/> </div>
                    <div className='col-md-3'> <input type='text' className='form-control' placeholder='Pekerjaan' ref={this.state.pekerjaan}/> </div>
                    <div className='col-md-3'> <input type='button' className='form-control btn-info' value='add Data' onClick={this.onAddData}/> </div>
                    <div>
                        <input type='button' className='btn btn-danger mt-4 w-100 h-100' value='Reset Data' onClick={this.onDeleteAllData}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default Home