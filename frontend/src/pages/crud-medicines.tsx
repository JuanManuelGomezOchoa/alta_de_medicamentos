"use client";
import { useEffect, useState } from 'react';
import './delIndex.css';
import axios from 'axios';

type TMedicines = {
    id?:number;
    name:string;
    pharmacy:string;
    benefit:string;
    price:string;
}
type TRes = {
    msg: string;
    data?: any
}


const headers = {
    headers: {
        "Content-Type": "application/json",
    }
}

export default function CrudMedicinesPage() {
    useEffect(() => {
        getMedicines();
    }, []);

    const [medicines, setMedicines] = useState<TMedicines[]>([]);
    const [medicine, setMedicine] = useState<TMedicines>({
        name: 'Paracetamol',
        pharmacy: 'Physer',
        benefit: 'Cualquiera',
        price: '127 pesos'
    });

    const [isEditable, setIsEditable] = useState(false);

    const onChange = (e: any) => {
        const data: any = medicine;
        data[e.target.name] = e.target.value;
        setMedicine(data);
    }
    



    const getMedicines = async () => {
        try {
            const response = await axios.get<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/get`);

            if (response.data.data) {
                setMedicines(response.data.data);
            }
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const createMedicines = async () => {
        try {
            await axios.post<TRes>(`${process.env.NEXT_PUBLIC_API_REST_URL}/create`, medicine, headers);
            getMedicines();
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const updateMedicine = async (id:number) => {
        try {
            await axios.put<TRes>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/update/${id}`,
                medicine,
                headers
            );
            getMedicines();
            setIsEditable(false);
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const deleteMedicine = async (id: number) => {
        try {
            await axios.delete<TRes>(
                `${process.env.NEXT_PUBLIC_API_REST_URL}/delete/${id}`,
            );
            getMedicines();
        } catch (error) {
            alert(`Hubo un error al realizar la peticion: ${error}`);
        }
    }

    const preUpdate = (e:TMedicines) => {
        setMedicine(e);
        setIsEditable(true);
    }

    return (
        
        <div>
            <h1>CRUD De Medicinas</h1>
            <div>
                <label htmlFor="name">Ingresa el nombre del medicamento:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='name'
                    placeholder='Nombre'
                /><br/>
                <label htmlFor="pharmacy">Ingresa la farmaceutica que elaboro el medicamento:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='pharmacy'
                    placeholder='Farmacia'
                /><br/>
                <label htmlFor="benefit">Ingresa el beneficio del medicamento:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='benefit'
                    placeholder='Beneficio'
                /><br/>
                <label htmlFor="price">Ingresa el precio del medicamento:</label><br />
                <input
                    type="text"
                    onChange={(e) => onChange(e)}
                    name='price'
                    placeholder='Precio'
                /><br/>
            </div>
            <button onClick={createMedicines}>Agregar Medicamento</button>
            <table>
                <tr>
                    <th>Nombre</th>
                    <th>Farmaceutica</th>
                    <th>Beneficio</th>
                    <th>Precio</th>
                </tr>
                {medicines.map((medicine, index) => (
                    <tr key={index}>
                        <td>{medicine.name}</td>
                        <td>{medicine.pharmacy}</td>
                        <td>{medicine.benefit}</td>
                        <td>{medicine.price}</td>
                        <td>
                            <button onClick={() => deleteMedicine(medicine.id ?? 0)}>Delete</button>
                        </td>
                        <td>
                            <button onClick={() => preUpdate(medicine)}>Update</button>
                        </td>
                    </tr>
                ))}
            </table>

            {
                isEditable && (
                    <div>
                        <h2>Formulario para actualizar</h2>
                        <label htmlFor="name">Ingresa el nombre del medicamento:</label><br />
                        <input
                            type="text"
                            onChange={(e) => onChange(e)}
                            defaultValue={medicine.name}
                            name='name'
                        /><br/>
                        <label htmlFor="pharmacy">Ingresa la farmaceutica del medicamento:</label><br />
                        <input
                            type="text"
                            onChange={(e) => onChange(e)}
                            defaultValue={medicine.pharmacy}
                            name='pharmacy'
                        /><br/>
                        <label htmlFor="benefit">Ingresa el beneficio del medicamento:</label><br />
                        <input
                            type="text"
                            onChange={(e) => onChange(e)}
                            defaultValue={medicine.benefit}
                            name='benefit'
                        /><br/>
                        <label htmlFor="price">Ingresa el precio del medicamento:</label><br />
                        <input
                            type="text"
                            onChange={(e) => onChange(e)}
                            defaultValue={medicine.price}
                            name='price'
                        /><br/>
                        <button onClick={() => updateMedicine(medicine.id ?? 0)}>Guardar</button>
                    </div>
                )
            }
        </div>
    );
}
