import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
    page: {
        padding: 20,
        backgroundColor: '#f5f5f5',
        display: 'flex',
        flexDirection: 'column',
        rowGap: 5
    },
    section: {
        marginBottom: 15,
        padding: 15,
        backgroundColor: 'white',
        borderRadius: 5,
        boxShadow: '0px 0px 5px rgba(0,0,0,0.1)',
    },
    header: {
        fontSize: 24,
        marginBottom: 15,
        textAlign: 'center',
        color: '#f97316',
    },
    title: {
        fontSize: 18,
        marginVertical: 10,
        color: '#f97316',
        fontWeight: 'bold',
    },
    text: {
        fontSize: 12,
        marginBottom: 5,
        color: '#4a4a4a',
        textAlign: 'center',
    },
    table: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
        borderBottom: '1px solid #f97316',
        paddingBottom: 10,
    },
    tableCol: {
        flex: 1,
        padding: 5,
        borderRight: '1px solid #e5e5e5',
        marginLeft: 5,
        marginRight: 5,
        alignItems: 'center',
    },
    tableRow: {
        display: 'flex',
        flex: 1,
        flexDirection: 'row',
        padding: 5,
        borderRight: '1px solid #e5e5e5',
        margin: 5,
        justifyContent: 'space-between'
    },
    tableCell: {
        fontSize: 14,
        color: '#f97316',
        fontWeight: 'bold',
        marginBottom: 5,
        textAlign: 'center',
    },
    passengerTable: {
        marginVertical: 12,
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#f97316',
        borderRadius: 5,
        overflow: 'hidden',
    },
    passengerTableHeader: {
        flexDirection: 'row',
        backgroundColor: '#f97316',
        padding: 5,
        color: 'white',
    },
    passengerTableRow: {
        flexDirection: 'row',
        borderBottom: '1px solid #e5e5e5',
        padding: 5,
        marginBottom: 8,
    },
    passengerTableCell: {
        flex: 1,
        textAlign: 'center',
        fontSize: 10,
    },
    horizontalRow: {
        width: '100%',
        height: 1,
        backgroundColor: '#f97316', // Color of the line
        marginVertical: 10, // Vertical spacing around the line
    },
});



const TicketDocument = ({ bookingDetails, pnrNo }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <View style={styles.section}>
                <Text style={styles.header}>Electronic Reservation Slip (ERS)</Text>
                <View style={styles.table}>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>From</Text>
                        <Text style={styles.text}>{bookingDetails?.source || "-"}</Text>
                        <Text style={styles.text}>Departure: {bookingDetails?.departureTime || "-"}</Text>
                    </View>
                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>{new Date(bookingDetails?.dateOfJourney).toLocaleDateString()}</Text>
                        <Text style={styles.text}>Duration: {`${bookingDetails?.duration?.hours || "00"}:${bookingDetails?.duration?.minutes || "00"}`}</Text>
                    </View>

                    <View style={styles.tableCol}>
                        <Text style={styles.tableCell}>To</Text>
                        <Text style={styles.text}>{bookingDetails?.destination || "N.A."}</Text>
                        <Text style={styles.text}>Arrival: {bookingDetails?.arrivalTime || "N.A."}</Text>
                    </View>
                </View>
                <Text style={styles.title}>PNR: {pnrNo}</Text>
                <View style={styles.tableRow}>
                    <Text style={styles.text}>Train No.: {bookingDetails?.trainNo || "N.A."}</Text>
                    <Text style={styles.text}>Train Name: {bookingDetails?.trainName || "N.A."}</Text>
                </View>
                <View style={styles.tableRow}>
                    <Text style={styles.text}>Class: {bookingDetails?.className || "N.A."}</Text>
                    <Text style={styles.text}>Booking Date: {new Date(bookingDetails?.bookingDate).toLocaleString()}</Text>
                </View>
                <View style={styles.horizontalRow}></View>
                <Text style={styles.title}>Passenger Details</Text>
                {bookingDetails?.passengerDetails?.length > 0 && (
                    <View style={styles.passengerTable}>
                        <View style={styles.passengerTableHeader}>
                            <Text style={styles.passengerTableCell}>Name</Text>
                            <Text style={styles.passengerTableCell}>Age</Text>
                            <Text style={styles.passengerTableCell}>Gender</Text>
                            <Text style={styles.passengerTableCell}>Type</Text>
                            <Text style={styles.passengerTableCell}>Booking Status</Text>
                            <Text style={styles.passengerTableCell}>Current Status</Text>
                            <Text style={styles.passengerTableCell}>Seat No</Text>
                        </View>
                        {bookingDetails.passengerDetails[0].map((passenger, idx) => (
                            <View key={idx} style={styles.passengerTableRow}>
                                <Text style={styles.passengerTableCell}>{passenger?.name}</Text>
                                <Text style={styles.passengerTableCell}>{passenger?.age}</Text>
                                <Text style={styles.passengerTableCell}>{passenger?.gender}</Text>
                                <Text style={styles.passengerTableCell}>{passenger?.passengerType}</Text>
                                <Text style={styles.passengerTableCell}>{passenger?.bookingStatus}</Text>
                                <Text style={styles.passengerTableCell}>{passenger?.currentStatus}</Text>
                                <Text style={styles.passengerTableCell}>{passenger?.seatNo || '-'}</Text>
                            </View>
                        ))}
                    </View>
                )}
                <Text style={styles.title}>Transaction ID: {bookingDetails?.paymentId || "N.A."}</Text>
                <Text style={styles.text}>Total Fare: {bookingDetails?.totalFare} Rs.</Text>
            </View>
        </Page>
    </Document>
);

export default TicketDocument;
