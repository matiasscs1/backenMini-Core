// doctorController.test.js

import httpMocks from 'node-mocks-http';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import Doctor from '../Model/doctor.user.js';
import {
  postDoctor,
  login,
  logout,
  deleteDoctorId,
  deleteDoctorEmail,
  getDoctor,
  updateDoctorId,
  getDoctorId,
  profile,
  verifyToken
} from '../Controller/doctor.controller.js'; // Ajusta la ruta según tu proyecto
import { createAcessToken } from '../libs/jwt.js';
import { TOKEN_SECRET } from '../config.js';

// Mocks de los módulos externos y del modelo Doctor
jest.mock('../Model/doctor.user.js');
jest.mock('bcrypt');
jest.mock('../libs/jwt.js');
jest.mock('jsonwebtoken');

describe("Doctor Controller", () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada caso
    jest.clearAllMocks();
  });

  describe("postDoctor", () => {
    let req, res;
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
      res.cookie = jest.fn();
    });

    it("debe retornar 400 si ya existe un doctor con ese correo", async () => {
      req.body = { email: "test@example.com", password: "password" };
      // Simula que se encontró un doctor ya registrado
      Doctor.findOne.mockResolvedValueOnce({ _id: "existingid" });

      await postDoctor(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual(["El usuario ya existe"]);
    });

    it("debe registrar un nuevo doctor", async () => {
      req.body = {
        email: "new@example.com",
        password: "password",
        Número_de_matriculaMedica: "12345",
        genero: "Masculino",
        nacimiento: "1990-01-01",
        ciudad: "Quito",
        direccion_Consultorio: "Calle Falsa 123",
        telefono: "123456789",
        especialidad: "Cardiología",
        apellido: "Pérez",
        nombre: "Juan"
      };

      // No se encuentra doctor previamente
      Doctor.findOne.mockResolvedValueOnce(null);
      const hashedPassword = "hashedpassword";
      bcrypt.hash.mockResolvedValueOnce(hashedPassword);
      const fakeDoctor = {
        _id: "newdoctorid",
        email: "new@example.com",
        save: jest.fn().mockResolvedValueOnce(true)
      };
      // Al crear una nueva instancia de Doctor, simulamos que retorna fakeDoctor
      Doctor.mockImplementation(() => fakeDoctor);
      const token = "token123";
      createAcessToken.mockResolvedValueOnce(token);

      await postDoctor(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("password", 10);
      expect(fakeDoctor.save).toHaveBeenCalled();
      expect(createAcessToken).toHaveBeenCalledWith({ id: fakeDoctor._id });
      expect(res.cookie).toHaveBeenCalledWith("token", token);
      expect(res._getJSONData()).toEqual({ id: fakeDoctor._id, email: fakeDoctor.email });
    });
  });

  describe("login", () => {
    let req, res;
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
      res.cookie = jest.fn();
    });

    it("debe retornar 400 si no encuentra al doctor", async () => {
      req.body = { email: "nouser@example.com", password: "password" };
      Doctor.findOne.mockResolvedValueOnce(null);

      await login(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Usuario no encontrado' });
    });

    it("debe retornar 400 si la contraseña es incorrecta", async () => {
      req.body = { email: "test@example.com", password: "wrongpassword" };
      const fakeDoctor = { _id: "doctorid", email: "test@example.com", password: "hashed" };
      Doctor.findOne.mockResolvedValueOnce(fakeDoctor);
      bcrypt.compare.mockResolvedValueOnce(false);

      await login(req, res);

      expect(res.statusCode).toBe(400);
      expect(res._getJSONData()).toEqual({ message: 'Contraseña incorrecta' });
    });

    it("debe iniciar sesión correctamente", async () => {
      req.body = { email: "test@example.com", password: "password" };
      const fakeDoctor = { _id: "doctorid", email: "test@example.com", password: "hashed" };
      Doctor.findOne.mockResolvedValueOnce(fakeDoctor);
      bcrypt.compare.mockResolvedValueOnce(true);
      const token = "token123";
      createAcessToken.mockResolvedValueOnce(token);

      await login(req, res);

      expect(createAcessToken).toHaveBeenCalledWith({ id: fakeDoctor._id });
      expect(res.cookie).toHaveBeenCalledWith("token", token);
      expect(res._getJSONData()).toEqual({ id: fakeDoctor._id, email: fakeDoctor.email });
    });
  });

  describe("logout", () => {
    it("debe borrar la cookie y retornar mensaje de logout satisfactorio", async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      res.cookie = jest.fn();

      await logout(req, res);

      expect(res.cookie).toHaveBeenCalledWith("token", "", { expires: expect.any(Date) });
      expect(res._getJSONData()).toEqual({ message: 'Logout exitoso' });
    });
  });

  describe("deleteDoctorId", () => {
    let req, res;
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    it("debe eliminar el doctor por ID y retornar mensaje de éxito", async () => {
      req.params.id = "doctorid";
      Doctor.findByIdAndDelete.mockResolvedValueOnce({ _id: "doctorid" });

      await deleteDoctorId(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: "Usuario eliminado correctamente" });
    });

    it("debe retornar 404 si no encuentra al doctor por ID", async () => {
      req.params.id = "doctorid";
      Doctor.findByIdAndDelete.mockResolvedValueOnce(null);

      await deleteDoctorId(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Usuario no encontrado" });
    });

    it("debe retornar 500 si ocurre un error", async () => {
      req.params.id = "doctorid";
      Doctor.findByIdAndDelete.mockRejectedValueOnce(new Error("Error DB"));

      await deleteDoctorId(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Error DB" });
    });
  });

  describe("deleteDoctorEmail", () => {
    let req, res;
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    it("debe eliminar el doctor por email y retornar mensaje de éxito", async () => {
      req.body.email = "test@example.com";
      Doctor.findOneAndDelete.mockResolvedValueOnce({ _id: "doctorid" });

      await deleteDoctorEmail(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual({ message: "Usuario eliminado correctamente" });
    });

    it("debe retornar 404 si no encuentra al doctor por email", async () => {
      req.body.email = "test@example.com";
      Doctor.findOneAndDelete.mockResolvedValueOnce(null);

      await deleteDoctorEmail(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Usuario no encontrado" });
    });

    it("debe retornar 500 si ocurre un error", async () => {
      req.body.email = "test@example.com";
      Doctor.findOneAndDelete.mockRejectedValueOnce(new Error("Error DB"));

      await deleteDoctorEmail(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Error DB" });
    });
  });

  describe("getDoctor", () => {
    let req, res;
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    it("debe retornar el listado de doctores", async () => {
      const doctorsArray = [
        { _id: "1", email: "doc1@example.com" },
        { _id: "2", email: "doc2@example.com" }
      ];
      Doctor.find.mockResolvedValueOnce(doctorsArray);

      await getDoctor(req, res);

      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(doctorsArray);
    });

    it("debe retornar 500 si ocurre un error", async () => {
      Doctor.find.mockRejectedValueOnce(new Error("DB error"));

      await getDoctor(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "DB error" });
    });
  });

  describe("updateDoctorId", () => {
    let req, res;
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    it("debe actualizar el doctor (omitiendo el campo password) y retornar el doctor actualizado", async () => {
      req.params.id = "doctorid";
      req.body = { email: "new@example.com", password: "noActualizar", other: "value" };
      const updatedDoctor = { _id: "doctorid", email: "new@example.com", other: "value" };

      Doctor.findByIdAndUpdate.mockResolvedValueOnce(updatedDoctor);

      await updateDoctorId(req, res);

      expect(Doctor.findByIdAndUpdate).toHaveBeenCalledWith(
        "doctorid",
        { email: "new@example.com", other: "value" },
        { new: true }
      );
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(updatedDoctor);
    });

    it("debe retornar 404 si no encuentra al doctor por ID", async () => {
      req.params.id = "doctorid";
      req.body = { email: "new@example.com" };
      Doctor.findByIdAndUpdate.mockResolvedValueOnce(null);

      await updateDoctorId(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Usuario no encontrado" });
    });

    it("debe retornar 500 si ocurre un error", async () => {
      req.params.id = "doctorid";
      req.body = { email: "new@example.com" };
      Doctor.findByIdAndUpdate.mockRejectedValueOnce(new Error("Error DB"));

      await updateDoctorId(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Error DB" });
    });
  });

  describe("getDoctorId", () => {
    let req, res;
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    it("debe retornar el doctor por ID y establecer Cache-Control en no-store", async () => {
      req.params.id = "doctorid";
      const doctorData = { _id: "doctorid", email: "test@example.com" };

      Doctor.findById.mockResolvedValueOnce(doctorData);

      await getDoctorId(req, res);

      expect(res.getHeader("Cache-Control")).toEqual("no-store");
      expect(res.statusCode).toBe(200);
      expect(res._getJSONData()).toEqual(doctorData);
    });

    it("debe retornar 404 si no se encuentra el doctor por ID", async () => {
      req.params.id = "doctorid";
      Doctor.findById.mockResolvedValueOnce(null);

      await getDoctorId(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "Usuario no encontrado" });
    });

    it("debe retornar 500 si ocurre un error", async () => {
      req.params.id = "doctorid";
      Doctor.findById.mockRejectedValueOnce(new Error("Error DB"));

      await getDoctorId(req, res);

      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "Error DB" });
    });
  });

  describe("profile", () => {
    let req, res;
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
    });

    it("debe retornar el perfil del doctor si se encuentra", async () => {
      req.user = { id: "doctorid" };
      const doctorData = { _id: "doctorid", email: "profile@example.com" };

      Doctor.findById.mockResolvedValueOnce(doctorData);

      await profile(req, res);

      expect(res._getJSONData()).toEqual({
        id: doctorData._id,
        email: doctorData.email
      });
    });

    it("debe retornar 404 si no encuentra al doctor en el perfil", async () => {
      req.user = { id: "doctorid" };
      Doctor.findById.mockResolvedValueOnce(null);

      await profile(req, res);

      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: " Token, no autirzado} " });
    });
  });

  describe("verifyToken", () => {
    let req, res;
    beforeEach(() => {
      req = httpMocks.createRequest();
      res = httpMocks.createResponse();
      res.cookie = jest.fn();
    });

    it("debe retornar 401 si no se proporciona token", async () => {
      req.cookies = {};

      await verifyToken(req, res);
      expect(res.statusCode).toBe(401);
      expect(res._getJSONData()).toEqual({ message: "no token" });
    });

    it("debe retornar 500 si falla la verificación del token", async () => {
      req.cookies = { token: "invalidtoken" };
      jwt.verify.mockImplementationOnce((token, secret, callback) => {
        callback(new Error("invalid"), null);
      });

      await verifyToken(req, res);
      expect(res.statusCode).toBe(500);
      expect(res._getJSONData()).toEqual({ message: "no token" });
    });

    it("debe retornar 404 si luego de la verificación no se encuentra el doctor", async () => {
      req.cookies = { token: "validtoken" };
      const decoded = { id: "doctorid" };
      jwt.verify.mockImplementationOnce((token, secret, callback) => {
        callback(null, decoded);
      });
      Doctor.findById.mockResolvedValueOnce(null);

      await verifyToken(req, res);
      expect(res.statusCode).toBe(404);
      expect(res._getJSONData()).toEqual({ message: "no user found" });
    });

    it("debe verificar el token y retornar la información del doctor", async () => {
      req.cookies = { token: "validtoken" };
      const decoded = { id: "doctorid" };
      jwt.verify.mockImplementationOnce((token, secret, callback) => {
        callback(null, decoded);
      });
      const doctorData = { _id: "doctorid", email: "verify@example.com" };
      Doctor.findById.mockResolvedValueOnce(doctorData);

      await verifyToken(req, res);
      expect(res._getJSONData()).toEqual({
        id: doctorData._id,
        email: doctorData.email
      });
    });
  });
});