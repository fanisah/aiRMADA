from typing import List
from ..schemas.anomaly import AnomalyRequest, AnomalyResult, AnomalyResponse, AnomalyType


def detect_anomalies(req: AnomalyRequest) -> AnomalyResponse:
    """
    Rule-based anomaly detection.
    Bisa diganti/ditambah model ML (Isolation Forest) di sprint berikutnya.
    """
    anomalies: List[AnomalyResult] = []

    # GPS tidak responsif
    if req.last_gps_minutes_ago > 15:
        severity = "high" if req.last_gps_minutes_ago > 30 else "medium"
        anomalies.append(AnomalyResult(
            vehicle_id=req.vehicle_id,
            anomaly_type=AnomalyType.GPS_SILENT,
            severity=severity,
            description=f"Tidak ada sinyal GPS selama {req.last_gps_minutes_ago} menit",
            confidence=0.95,
        ))

    # Penyimpangan rute
    if req.deviation_km and req.deviation_km > 2.0:
        severity = "high" if req.deviation_km > 5.0 else "medium"
        anomalies.append(AnomalyResult(
            vehicle_id=req.vehicle_id,
            anomaly_type=AnomalyType.ROUTE_DEVIATION,
            severity=severity,
            description=f"Kendaraan menyimpang {req.deviation_km:.1f} km dari rute",
            confidence=0.90,
        ))

    # Keterlambatan
    if req.eta_overdue_minutes and req.eta_overdue_minutes > 30:
        severity = "high" if req.eta_overdue_minutes > 60 else "medium"
        anomalies.append(AnomalyResult(
            vehicle_id=req.vehicle_id,
            anomaly_type=AnomalyType.LATE_DELIVERY,
            severity=severity,
            description=f"Terlambat {req.eta_overdue_minutes} menit dari estimasi",
            confidence=0.99,
        ))

    return AnomalyResponse(anomalies=anomalies)
