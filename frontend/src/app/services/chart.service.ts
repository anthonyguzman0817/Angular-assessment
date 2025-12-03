import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Planet {
    sign: string;
    degree: number;
}

export interface Chart {
    id?: string;
    _id?: string;
    name: string;
    birthDate: string;
    birthTime: string;
    birthLocation: string;
    sunSign: string;
    moonSign: string;
    risingSign: string;
    planets?: {
        sun?: Planet;
        moon?: Planet;
        mercury?: Planet;
        venus?: Planet;
        mars?: Planet;
    };
}

interface ApiResponse<T> {
    success: boolean;
    data: T;
    count?: number;
    total?: number;
    page?: number;
    pages?: number;
    error?: string;
}

export interface CalculateChartRequest {
    birthDate: string;
    birthTime: string;
    birthLocation: string;
}

export interface PaginationParams {
    page?: number;
    limit?: number;
    sunSign?: string;
    isPublic?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface PaginationInfo {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    count: number;
}

export interface PaginatedChartsResponse {
    charts: Chart[];
    pagination: PaginationInfo;
}

@Injectable({
    providedIn: 'root'
})
export class ChartService {
    private apiUrl = '/api';

    constructor(private http: HttpClient) { }

    private mapChart(chart: any): Chart {
        return {
            id: chart._id || chart.id,
            _id: chart._id,
            name: chart.name,
            birthDate: chart.birthDate,
            birthTime: chart.birthTime,
            birthLocation: chart.birthLocation,
            sunSign: chart.sunSign,
            moonSign: chart.moonSign,
            risingSign: chart.risingSign,
            planets: chart.planets || {}
        };
    }

    getAllCharts(params?: PaginationParams): Observable<PaginatedChartsResponse> {
        let url = `${this.apiUrl}/charts`;
        const queryParams: string[] = [];
        
        if (params) {
            if (params.page) queryParams.push(`page=${params.page}`);
            if (params.limit) queryParams.push(`limit=${params.limit}`);
            if (params.sunSign) queryParams.push(`sunSign=${encodeURIComponent(params.sunSign)}`);
            if (params.isPublic !== undefined) queryParams.push(`isPublic=${params.isPublic}`);
            if (params.sortBy) queryParams.push(`sortBy=${params.sortBy}`);
            if (params.sortOrder) queryParams.push(`sortOrder=${params.sortOrder}`);
            
            if (queryParams.length > 0) {
                url += `?${queryParams.join('&')}`;
            }
        }

        return this.http.get<ApiResponse<Chart[]>>(url).pipe(
            map(response => {
                if (response.success && response.data) {
                    const charts = response.data.map(chart => this.mapChart(chart));
                    const limit = params?.limit || 10;
                    const pagination: PaginationInfo = {
                        currentPage: response.page || 1,
                        totalPages: response.pages || 1,
                        totalItems: response.total || 0,
                        itemsPerPage: limit,
                        count: response.count || charts.length
                    };
                    return { charts, pagination };
                }
                if (!response.success && response.error) {
                    throw new Error(response.error);
                }
                return {
                    charts: [],
                    pagination: {
                        currentPage: 1,
                        totalPages: 1,
                        totalItems: 0,
                        itemsPerPage: 10,
                        count: 0
                    }
                };
            }),
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    getChartById(id: string): Observable<Chart> {
        return this.http.get<ApiResponse<Chart>>(`${this.apiUrl}/charts/${id}`).pipe(
            map(response => {
                if (response.success && response.data) {
                    return this.mapChart(response.data);
                }
                throw new Error(response.error || 'Chart not found');
            }),
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    calculateChart(request: CalculateChartRequest): Observable<Chart> {
        return this.http.post<ApiResponse<Chart>>(`${this.apiUrl}/charts/calculate`, request).pipe(
            map(response => {
                if (response.success && response.data) {
                    return this.mapChart(response.data);
                }
                throw new Error(response.error || 'Failed to calculate chart');
            }),
            catchError(error => {
                return throwError(() => error);
            })
        );
    }

    initializeProject(): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/init`);
    }
}

