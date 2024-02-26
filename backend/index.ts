import { Server, ic } from 'azle';
import cors from "cors";
import express from 'express';


type TMedicine = {
    id:number;
    name:string;
    pharmacy:string;
    benefit:string;
    price:string;
}

let medicines: TMedicine[] = [
    {
        id:1,
        name:"Paracetamol",
        pharmacy:"Physer",
        benefit:"Control de dolor de cabeza",
        price:"127 pesos"
    }
]

export default Server(() => {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // app.use((req, res, next) => {
    //     if (ic.caller().isAnonymous()) {
    //         res.status(401);
    //         res.send();
    //     } else {
    //         next();
    //     }
    // });

    app.post('/create',(req, res)=>{
        const medicine = medicines.find((medicine)=>medicine.id === parseInt(req.body.id));
        if(medicine){
            res.status(400).json({msg:"El id ya esta en uso.", data:medicine});
            return;
        }
        req.body.id = medicines[medicines.length - 1].id + 1;
        medicines.push(req.body);
        res.status(200).json({msg:"El medicamento se añadio exitosamente"});
    });

    app.get('/get',(req,res)=>{
        res.status(200).json({msg:"Los medicamentos se añadieron de forma exitosa", data:medicines});
    });

    app.put('/update/:id', (req, res)=>{
        const medicine = medicines.find((medicine)=>medicine.id === parseInt(req.params.id));

        if(!medicine){
            res.status(404).json({msg:"El medicamento que se busca actualizar no existe."});
            return;
        }

        const UMedicine = {...medicine, ...req.body};

        medicines = medicines.map((e) => e.id === UMedicine.id ? UMedicine : e);

        res.status(200).json({msg:"El medicamento se actualizo de forma exitosa"});
    });

    app.delete('/delete/:id',(req, res)=>{
        medicines = medicines.filter((e) => e.id !== parseInt(req.params.id));
        res.status(200).json({msg:"Medicamento eliminado de forma exitosa", data:medicines});
    });



    app.post('/test', (req, res) => {
        res.json(req.body);
    });

    app.get('/whoami', (req, res) => {
        res.statusCode = 200;
        res.send(ic.caller());
    });

    app.get('/health', (req, res) => {
        res.send().statusCode = 204;
    });

    return app.listen();
});
