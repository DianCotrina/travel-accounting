using TravelAccounting.Domain.Common;

namespace TravelAccounting.Domain.Trips;

public sealed class Trip
{
    public Guid Id { get; private set; }
    public string Name { get; private set; }
    public string DestinationCountry { get; private set; }
    public Currency HomeCurrency { get; private set; }
    public Currency LocalCurrency { get; private set; }
    public TravelDate StartDate { get; private set; }
    public TravelDate EndDate { get; private set; }
    public TripStatus Status { get; private set; }

    public Trip(
        Guid id,
        string name,
        string destinationCountry,
        Currency homeCurrency,
        Currency localCurrency,
        TravelDate startDate,
        TravelDate endDate)
    {
        if (id == Guid.Empty)
        {
            throw new ArgumentException("Trip id cannot be empty.", nameof(id));
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Trip name cannot be empty.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(destinationCountry))
        {
            throw new ArgumentException("Destination country cannot be empty.", nameof(destinationCountry));
        }

        if (endDate.Value < startDate.Value)
        {
            throw new ArgumentException("Trip end date cannot be before start date.");
        }

        Id = id;
        Name = name.Trim();
        DestinationCountry = destinationCountry.Trim();
        HomeCurrency = homeCurrency ?? throw new ArgumentNullException(nameof(homeCurrency));
        LocalCurrency = localCurrency ?? throw new ArgumentNullException(nameof(localCurrency));
        StartDate = startDate;
        EndDate = endDate;
        Status = TripStatus.Active;
    }

    public void Update(
        string name,
        string destinationCountry,
        Currency homeCurrency,
        Currency localCurrency,
        TravelDate startDate,
        TravelDate endDate)
    {
        if (Status == TripStatus.Archived)
        {
            throw new InvalidOperationException("Archived trips cannot be updated.");
        }

        if (string.IsNullOrWhiteSpace(name))
        {
            throw new ArgumentException("Trip name cannot be empty.", nameof(name));
        }

        if (string.IsNullOrWhiteSpace(destinationCountry))
        {
            throw new ArgumentException("Destination country cannot be empty.", nameof(destinationCountry));
        }

        if (endDate.Value < startDate.Value)
        {
            throw new ArgumentException("Trip end date cannot be before start date.");
        }

        Name = name.Trim();
        DestinationCountry = destinationCountry.Trim();
        HomeCurrency = homeCurrency ?? throw new ArgumentNullException(nameof(homeCurrency));
        LocalCurrency = localCurrency ?? throw new ArgumentNullException(nameof(localCurrency));
        StartDate = startDate;
        EndDate = endDate;
    }

    public void Archive()
    {
        if (Status == TripStatus.Archived)
        {
            throw new InvalidOperationException("Trip is already archived.");
        }

        Status = TripStatus.Archived;
    }
}
