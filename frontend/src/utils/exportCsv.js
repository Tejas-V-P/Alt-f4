export const exportToCSV = (applications, filename = 'Placement_Applications.csv') => {
  if (!applications || !applications.length) {
    alert('No application data to export.');
    return;
  }

  const headers = ['Company Name', 'Role', 'Application Date', 'Status', 'Location', 'Salary', 'Wishlist', 'Notes'];

  const rows = applications.map(app => [
    `"${(app.companyName || '').replace(/"/g, '""')}"`,
    `"${(app.role || '').replace(/"/g, '""')}"`,
    `"${app.applicationDate || ''}"`,
    `"${app.status || ''}"`,
    `"${(app.location || '').replace(/"/g, '""')}"`,
    `"${(app.salary || '').replace(/"/g, '""')}"`,
    `"${app.isWishlist ? 'Yes' : 'No'}"`,
    `"${(app.notes || '').replace(/"/g, '""')}"`
  ]);

  const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
  const encodedUri = encodeURI(csvContent);

  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
