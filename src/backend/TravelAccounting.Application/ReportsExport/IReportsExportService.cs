namespace TravelAccounting.Application.ReportsExport;

public interface IReportsExportService
{
    Task<TripReportSummaryDto?> GetSummaryAsync(
        Guid tripId,
        DateOnly? fromDate,
        DateOnly? toDate,
        string? category,
        CancellationToken cancellationToken);

    Task<TripReportCsvResultDto?> ExportCsvAsync(
        Guid tripId,
        DateOnly? fromDate,
        DateOnly? toDate,
        string? category,
        CancellationToken cancellationToken);
}
