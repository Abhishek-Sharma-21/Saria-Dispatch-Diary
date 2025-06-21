// PreviousDispatch.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { toast } from "react-hot-toast";

export default function PreviousDispatch() {
  const [entries, setEntries] = useState([]);
  const apiUrl = import.meta.env.VITE_BACKEND_URL;


  useEffect(() => {
    axios
      .get(`${apiUrl}/dispatches`)
      .then((res) => {
        console.log("Backend data:", res.data);
        setEntries(res.data);
      })
      .catch((err) => console.error(err));
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
    // Underline: measure text width and draw a line under the text
    const textWidth = doc.getTextWidth(title);
    doc.setLineWidth(0.5);
    doc.line(10, 14, 10 + textWidth, 14);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(14);
    doc.text(`Dispatch Report`, 10, 22);
    doc.setFontSize(12);
    doc.text(`Created At: ${createdAt}`, 10, 32);

    let y = 42;
    group.forEach((entry, i) => {
      doc.text(`${i + 1}. Supplier: ${entry.supplier}`, 10, y);
      y += 7;
      doc.text(`   Vehicle: ${entry.vehicle}`, 10, y);
      y += 7;
      doc.text(`   Weight: ${entry.weight} MT`, 10, y);
      y += 10;
    });

    doc.save(`dispatch_group_${createdAt.replace(/\W+/g, "_")}.pdf`);
  };

  // PDF share using jsPDF and Web Share API
  const handleShare = async (group, createdAt) => {
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

    let y = 42;
    group.forEach((entry, i) => {
      doc.text(`${i + 1}. Supplier: ${entry.supplier}`, 10, y);
      y += 7;
      doc.text(`   Vehicle: ${entry.vehicle}`, 10, y);
      y += 7;
      doc.text(`   Weight: ${entry.weight} MT`, 10, y);
      y += 10;
    });

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
  };

  // Delete all dispatches in a group
  const handleDeleteGroup = async (group, createdAt) => {
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
    }
  };

  // Placeholder for edit functionality
  const handleEditGroup = (group, createdAt) => {
    toast("Edit feature coming soon!");
  };

  return (
    <div className="flex flex-col gap-6 px-2 sm:px-0">
      {Object.entries(grouped).map(([createdAt, group]) => (
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
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition-all duration-200"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12h7m0 0l-3-3m3 3l-3 3M9 12a6 6 0 016-6h1m-7 6a6 6 0 016 6h1" />
                </svg>
                Share PDF
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
                aria-label="Delete group"
                className="p-2 rounded-full text-red-600 hover:text-red-800 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition-all duration-200 bg-transparent shadow-none"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4a2 2 0 012 2v2H7V5a2 2 0 012-2zm0 0V3m0 2v2" />
                </svg>
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
      ))}
    </div>
  );
}
