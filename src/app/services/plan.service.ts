import { Injectable } from '@angular/core';
import { collection, Firestore, addDoc, CollectionReference, getDocs, getDoc, doc, setDoc, deleteDoc, query, orderBy } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class PlanService {

  collectionName = 'Plan';
  collection: CollectionReference

  constructor(
    private firestore: Firestore
  ) {
    this.collection = collection(this.firestore, this.collectionName)
  }

  async createRegister(record: any) {
    const newRegisterRef = await addDoc(this.collection, record)
    const registerData = await getDoc(newRegisterRef)
    return { ...registerData.data(), id: newRegisterRef.id };
  }

  async getRegisters() {
    const registers = await getDocs(query(this.collection, orderBy('createdAt', 'desc')))
    return registers.docs.map(register => ({ ...register.data(), id: register.id }));
  }

  async getRegisterById(recordID: any) {
    const document = doc(this.collection, recordID)
    const registerData = await getDoc(document)
    return {...registerData.data(), id: registerData.id}
  }

  async updateRegister(recordID: any, record: any) {
    const document = doc(this.collection, recordID)
    const registerData = await getDoc(document)
    const newbody = { ...registerData.data(), ...record }
    return setDoc(document, newbody)
  }

  deleteRegister(recordID: any) {
    const document = doc(this.collection, recordID)
    return deleteDoc(document)
  }
}
