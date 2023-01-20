import { Request, Response, NextFunction } from 'express';
import Location from '../../database/models/location';
const LocationController = {


  async getAllBuildings(request: Request, response: Response): Promise<void> {
    const result = await Location.findAll({
      attributes: ['building','geometry'],
      group: ['building','geometry']
    });
    response.json(result);
  },
  async getGeometryByBuilding(request: Request, response: Response): Promise<void> {
    const shortname = request.params.name;
    const result = await Location.findOne({
      attributes: ['geometry'],
      where: { shortname: shortname }
    });
    response.json(result);
  }
}

export default LocationController;
