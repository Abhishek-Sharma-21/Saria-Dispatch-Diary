// PreviousDispatch.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";

export default function PreviousDispatch() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingGroup, setDeletingGroup] = useState(null);
  const [sharingGroup, setSharingGroup] = useState(null);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    setLoading(true);
    axios
      .get(`${apiUrl}/dispatches`)
      .then((res) => {
        console.log("Backend data:", res.data);
        setEntries(res.data);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Error fetching dispatches");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Group dispatches by createdAt (to the minute)
  function groupByCreatedAt(entries) {
    return entries.reduce((groups, entry) => {
      const createdAt = new Date(entry.createdAt);
      // Format: YYYY-MM-DD HH:mm
      const key = createdAt.toLocaleString(undefined, {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      });
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
      return groups;
    }, {});
  }

  const grouped = groupByCreatedAt(entries);

  // PDF download using jsPDF
  const handleDownload = (group, createdAt) => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    const title = "Darshan Kumar Sharma";
    doc.text(title, 10, 12);
    const textWidth = doc.getTextWidth(title);
    doc.setLineWidth(0.5);
    doc.line(10, 14, 10 + textWidth, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Dispatch Report`, 10, 22);
    doc.setFontSize(12);
    doc.text(`Created At: ${createdAt}`, 10, 32);

    // Table layout
    const startX = 10;
    const startY = 44;
    const colWidths = [18, 55, 55, 35]; // S.No, Supplier, Vehicle, Weight
    const colX = [startX, startX + colWidths[0], startX + colWidths[0] + colWidths[1], startX + colWidths[0] + colWidths[1] + colWidths[2], startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]];
    let y = startY;

    // Draw header
    doc.setFont('helvetica', 'bold');
    doc.text('S.No', colX[0] + 2, y + 6);
    doc.text('Supplier', colX[1] + 2, y + 6);
    doc.text('Vehicle', colX[2] + 2, y + 6);
    doc.text('Weight (MT)', colX[3] + 2, y + 6);
    doc.setFont('helvetica', 'normal');

    // Draw header border
    doc.setLineWidth(0.3);
    doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 10);
    y += 10;

    let totalWeight = 0;
    group.forEach((entry, i) => {
      doc.text(String(i + 1), colX[0] + 2, y + 6);
      doc.text(entry.supplier, colX[1] + 2, y + 6);
      doc.text(entry.vehicle, colX[2] + 2, y + 6);
      doc.text(String(entry.weight), colX[3] + 2, y + 6, { align: 'left' });
      // Draw row border
      doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 10);
      totalWeight += parseFloat(entry.weight) || 0;
      y += 10;
    });

    // Total row
    doc.setFont('helvetica', 'bold');
    doc.text('Total', colX[1] + 2, y + 6);
    doc.text(totalWeight.toFixed(3) + ' MT', colX[3] + 2, y + 6, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    // Draw total row border
    doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 10);

    // Draw vertical lines for columns
    for (let i = 1; i < colX.length - 1; i++) {
      doc.line(colX[i], startY, colX[i], y + 10);
    }

    doc.save(`dispatch_group_${createdAt.replace(/\W+/g, "_")}.pdf`);
  };

  // PDF share using jsPDF and Web Share API
  const handleShare = async (group, createdAt) => {
    setSharingGroup(createdAt);
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    const title = "Darshan Kumar Sharma";
    doc.text(title, 10, 12);
    const textWidth = doc.getTextWidth(title);
    doc.setLineWidth(0.5);
    doc.line(10, 14, 10 + textWidth, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Dispatch Report`, 10, 22);
    doc.setFontSize(12);
    doc.text(`Created At: ${createdAt}`, 10, 32);

    // Table layout
    const startX = 10;
    const startY = 44;
    const colWidths = [18, 55, 55, 35];
    const colX = [startX, startX + colWidths[0], startX + colWidths[0] + colWidths[1], startX + colWidths[0] + colWidths[1] + colWidths[2], startX + colWidths[0] + colWidths[1] + colWidths[2] + colWidths[3]];
    let y = startY;

    // Draw header
    doc.setFont('helvetica', 'bold');
    doc.text('S.No', colX[0] + 2, y + 6);
    doc.text('Supplier', colX[1] + 2, y + 6);
    doc.text('Vehicle', colX[2] + 2, y + 6);
    doc.text('Weight (MT)', colX[3] + 2, y + 6);
    doc.setFont('helvetica', 'normal');

    // Draw header border
    doc.setLineWidth(0.3);
    doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 10);
    y += 10;

    let totalWeight = 0;
    group.forEach((entry, i) => {
      doc.text(String(i + 1), colX[0] + 2, y + 6);
      doc.text(entry.supplier, colX[1] + 2, y + 6);
      doc.text(entry.vehicle, colX[2] + 2, y + 6);
      doc.text(String(entry.weight), colX[3] + 2, y + 6, { align: 'left' });
      // Draw row border
      doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 10);
      totalWeight += parseFloat(entry.weight) || 0;
      y += 10;
    });

    // Total row
    doc.setFont('helvetica', 'bold');
    doc.text('Total', colX[1] + 2, y + 6);
    doc.text(totalWeight.toFixed(3) + ' MT', colX[3] + 2, y + 6, { align: 'left' });
    doc.setFont('helvetica', 'normal');
    // Draw total row border
    doc.rect(startX, y, colWidths.reduce((a, b) => a + b, 0), 10);

    // Draw vertical lines for columns
    for (let i = 1; i < colX.length - 1; i++) {
      doc.line(colX[i], startY, colX[i], y + 10);
    }

    // Get PDF as Blob
    const pdfBlob = doc.output('blob');
    const file = new File([pdfBlob], `dispatch_group_${createdAt.replace(/\W+/g, "_")}.pdf`, { type: "application/pdf" });

    if (navigator.canShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({
          files: [file],
          title: "Dispatch Report",
          text: "Sharing dispatch report PDF via WhatsApp or any app.",
        });
      } catch (err) {
        alert("Share cancelled or failed.");
      }
    } else {
      alert("Sharing files is not supported on this device/browser. Please use the Download button instead.");
    }
    setSharingGroup(null);
  };

  // Delete all dispatches in a group
  const handleDeleteGroup = async (group, createdAt) => {
    setDeletingGroup(createdAt);
    try {
      // Delete each dispatch in the group
      await Promise.all(
        group.map((entry) =>
          axios.delete(`${apiUrl}/dispatches/${entry._id}`)
        )
      );
      toast.success("Group deleted!");
      // Remove deleted entries from UI
      setEntries((prev) => prev.filter((e) => !group.some((g) => g._id === e._id)));
    } catch (err) {
      toast.error("Error deleting group");
    } finally {
      setDeletingGroup(null);
    }
  };

  // Placeholder for edit functionality
  const handleEditGroup = (group, createdAt) => {
    toast("Edit feature coming soon!");
  };

  return (
    <div className="flex flex-col gap-6 px-2 sm:px-0">
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-700"></div>
          <span className="ml-3 text-lg text-gray-600">Loading dispatches...</span>
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-500 text-lg">No dispatches found</div>
          <div className="text-gray-400 text-sm mt-2">Create your first dispatch to see it here</div>
        </div>
      ) : (
        Object.entries(grouped).map(([createdAt, group]) => (
          <div
            key={createdAt}
            className="border rounded-lg p-4 shadow bg-white space-y-3 text-sm sm:text-base"
          >
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold text-center text-red-700 bg-gray-100 py-2 rounded shadow">
                Darshan Kumar Sharma
              </h1>
              <h2 className="text-base sm:text-lg font-bold text-gray-700">
                Created At: {createdAt}
              </h2>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleDownload(group, createdAt)}
                  className="flex items-center gap-2 px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-blue-400 text-white font-semibold shadow-md hover:from-blue-700 hover:to-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v12m0 0l-4-4m4 4l4-4m-8 8h8" />
                  </svg>
                  Download PDF
                </button>
                <button
                  onClick={() => handleShare(group, createdAt)}
                  disabled={sharingGroup === createdAt}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-semibold shadow-md transition-all duration-200 ${
                    sharingGroup === createdAt
                      ? 'bg-green-400 cursor-not-allowed opacity-75'
                      : 'bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2'
                  }`}
                >
                  {sharingGroup === createdAt ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12h7m0 0l-3-3m3 3l-3 3M9 12a6 6 0 016-6h1m-7 6a6 6 0 016 6h1" />
                    </svg>
                  )}
                  {sharingGroup === createdAt ? 'Sharing...' : 'Share PDF'}
                </button>
                <button
                  onClick={() => handleEditGroup(group, createdAt)}
                  aria-label="Edit group"
                  className="p-2 rounded-full text-yellow-600 hover:text-yellow-800 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 transition-all duration-200 bg-transparent shadow-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536M9 13l6.586-6.586a2 2 0 112.828 2.828L11.828 15.828a2 2 0 01-2.828 0L9 13zm-6 6h12" />
                  </svg>
                </button>
                <button
                  onClick={() => handleDeleteGroup(group, createdAt)}
                  disabled={deletingGroup === createdAt}
                  aria-label="Delete group"
                  className={`p-2 rounded-full transition-all duration-200 bg-transparent shadow-none ${
                    deletingGroup === createdAt
                      ? 'text-red-400 cursor-not-allowed opacity-75'
                      : 'text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2'
                  }`}
                >
                  {deletingGroup === createdAt ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-red-600"></div>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2zm0 0V3m0 2v2" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <ul className="text-gray-700 list-disc pl-5 space-y-1">
              {group.map((entry) => (
                <li key={entry._id}>
                  <span className="font-medium">{entry.supplier}</span> - {entry.vehicle} - {entry.weight} MT
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}
