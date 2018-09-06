package org.treez.data.table.nebula.nat.pagination;

import org.eclipse.nebula.widgets.pagination.AbstractPageControllerComposite;
import org.eclipse.nebula.widgets.pagination.PageableController;
import org.eclipse.swt.SWT;
import org.eclipse.swt.events.FocusEvent;
import org.eclipse.swt.events.FocusListener;
import org.eclipse.swt.layout.GridData;
import org.eclipse.swt.layout.GridLayout;
import org.eclipse.swt.widgets.Composite;
import org.eclipse.swt.widgets.Display;
import org.eclipse.swt.widgets.Label;
import org.eclipse.swt.widgets.Text;
import org.eclipse.ui.forms.widgets.FormToolkit;
import org.treez.core.Activator;

public class PaginationComponentRenderer extends AbstractPageControllerComposite {

	//#region ATTRIBUTES

	private Label resultLabel;

	private Label first;

	private Label previous;

	private Text currentPageIndexField;

	private Label totalPagesLabel;

	private Label next;

	private Label last;

	private Text pageSizeField;

	private final int maxPageSize = 1000000;

	//#end region

	//#region CONSTRUCTORS

	public PaginationComponentRenderer(Composite parent, int style, PageableController controller) {
		super(parent, style, controller);
		refreshEnabled(controller);
	}

	//#end region

	//#region METHODS

	@Override
	protected void createUI(Composite parent) {

		GridLayout parentLayout = new GridLayout(1, false);
		parentLayout.verticalSpacing = 0;
		parentLayout.marginTop = 0;
		parentLayout.marginBottom = 0;
		parent.setLayout(parentLayout);

		GridLayout layout = new GridLayout(1, false);
		layout.verticalSpacing = 0;
		layout.marginTop = 0;
		layout.marginBottom = 0;
		this.setLayout(layout);

		createButtonsAndInputFields(parent);

		createRowLimitForPagesField(parent);
	}

	@SuppressWarnings("checkstyle:magicnumber")
	private void createButtonsAndInputFields(Composite parent) {

		FormToolkit toolkit = new FormToolkit(Display.getCurrent());
		PageableController controller = getController();

		Composite rowContainer = toolkit.createComposite(parent);

		GridLayout layout = new GridLayout(8, false);
		layout.verticalSpacing = 0;
		layout.marginTop = 0;
		layout.marginBottom = 0;
		rowContainer.setLayout(layout);
		rowContainer.setLayoutData(new GridData(SWT.FILL, SWT.NONE, true, false));

		createRowsLabel(toolkit, rowContainer);

		toolkit.createLabel(rowContainer, "     Page ");

		createFirstButton(toolkit, rowContainer, controller);
		createPreviousButton(toolkit, rowContainer, controller);

		createCurrentPageField(toolkit, rowContainer);

		crateNextButton(toolkit, rowContainer, controller);
		createLastButton(toolkit, rowContainer, controller);

		createMaxPageLabel(toolkit, rowContainer, controller);

	}

	private void createFirstButton(FormToolkit toolkit, Composite container, PageableController controller) {

		first = toolkit.createLabel(container, "", SWT.NONE);
		first.setImage(Activator.getImage("first.png"));
		first.addListener(SWT.MouseDown, (e) -> {
			controller.setCurrentPage(0);
		});
	}

	private void createPreviousButton(FormToolkit toolkit, Composite container, PageableController controller) {
		previous = toolkit.createLabel(container, "", SWT.NONE);
		previous.setImage(Activator.getImage("previous.png"));
		previous.addListener(SWT.MouseDown, (e) -> {
			controller.setCurrentPage(controller.getCurrentPage() - 1);
		});
	}

	@SuppressWarnings("checkstyle:magicnumber")
	private void createCurrentPageField(FormToolkit toolkit, Composite container) {
		currentPageIndexField = toolkit.createText(container, "1", SWT.NONE);
		currentPageIndexField.setLayoutData(new GridData(40, 15));
		currentPageIndexField.setToolTipText("Page index");
		currentPageIndexField.addTraverseListener((e) -> updateCurrentPageIndex());
		currentPageIndexField.addFocusListener(new FocusListener() {

			@Override
			public void focusLost(FocusEvent e) {
				updateCurrentPageIndex();
			}

			@Override
			public void focusGained(FocusEvent e) {

			}

		});

	}

	private void updateCurrentPageIndex() {
		PageableController controller = getController();
		int pageNumberStartingWithOne = getValidPageIndex();
		controller.setCurrentPage(pageNumberStartingWithOne - 1);
		currentPageIndexField.setText("" + pageNumberStartingWithOne);
	}

	private void createMaxPageLabel(FormToolkit toolkit, Composite parent, PageableController controller) {
		Composite container = toolkit.createComposite(parent);
		GridLayout layout = new GridLayout(2, false);
		layout.verticalSpacing = 0;
		layout.marginTop = 0;
		layout.marginBottom = 0;
		container.setLayout(layout);

		toolkit.createLabel(container, "of");
		totalPagesLabel = toolkit.createLabel(container, "" + controller.getTotalPages());
	}

	private void crateNextButton(FormToolkit toolkit, Composite container, PageableController controller) {
		next = toolkit.createLabel(container, "", SWT.NONE);
		next.setImage(Activator.getImage("next.png"));
		next.addListener(SWT.MouseDown, (e) -> {
			controller.setCurrentPage(controller.getCurrentPage() + 1);
		});
	}

	private void createLastButton(FormToolkit toolkit, Composite container, PageableController controller) {
		last = toolkit.createLabel(container, "", SWT.NONE);
		last.setImage(Activator.getImage("last.png"));
		last.addListener(SWT.MouseDown, (e) -> {
			controller.setCurrentPage(controller.getTotalPages() - 1);
		});
	}

	private void createRowsLabel(FormToolkit toolkit, Composite parent) {
		resultLabel = toolkit.createLabel(parent, ""); //also see method getResultsText
	}

	@SuppressWarnings("checkstyle:magicnumber")
	private void createRowLimitForPagesField(Composite parent) {

		FormToolkit toolkit = new FormToolkit(Display.getCurrent());
		PageableController controller = getController();

		Composite container = toolkit.createComposite(parent);
		GridLayout layout = new GridLayout(3, false);
		layout.verticalSpacing = 0;
		layout.marginTop = 0;
		layout.marginBottom = 0;

		container.setLayout(layout);
		GridData gridData = new GridData(SWT.FILL, SWT.FILL, true, false);
		container.setLayoutData(gridData);

		toolkit.createLabel(container, "Max rows per page: ");

		pageSizeField = toolkit.createText(container, "" + controller.getPageSize(), SWT.NONE);
		pageSizeField.setToolTipText("Maximum number of rows per page");

		pageSizeField.setLayoutData(new GridData(40, 15));

		pageSizeField.addTraverseListener((e) -> upatePageSize());
		pageSizeField.addFocusListener(new FocusListener() {

			@Override
			public void focusLost(FocusEvent e) {
				upatePageSize();
			}

			@Override
			public void focusGained(FocusEvent arg0) {}

		});
	}

	private void upatePageSize() {
		PageableController controller = getController();
		int pageSize = getValidPageSize();
		pageSizeField.setText("" + pageSize);
		controller.setPageSize(pageSize);

		updateCurrentPageIndex();
	}

	@Override
	public void pageIndexChanged(int oldPageNumber, int newPageNumber, PageableController controller) {
		currentPageIndexField.setText("" + (controller.getCurrentPage() + 1));
		refreshEnabled(controller);
	}

	@Override
	public void totalElementsChanged(long oldTotalElements, long newTotalElements, PageableController controller) {
		totalPagesLabel.setText("" + controller.getTotalPages());
		upatePageSize();
		refreshEnabled(controller);
	}

	@Override
	public void pageSizeChanged(int oldPageSize, int newPageSize, PageableController controller) {
		pageSizeField.setText("" + controller.getPageSize());
		totalPagesLabel.setText("" + controller.getTotalPages());
		refreshEnabled(controller);
	}

	@Override
	public void sortChanged(
			String oldPopertyName,
			String propertyName,
			int oldSortDirection,
			int sortDirection,
			PageableController paginationController) {
		// Do nothing
	}

	private int getValidPageIndex() {
		PageableController controller = getController();
		int currentPageIndex = controller.getCurrentPage() + 1;
		int pageIndex = currentPageIndex;
		try {
			pageIndex = Integer.parseInt(currentPageIndexField.getText());
		} catch (NumberFormatException exception) {}

		if (pageIndex < 1) {
			return currentPageIndex;
		}

		int totalPages = controller.getTotalPages();
		if (pageIndex > totalPages) {
			return totalPages;
		}

		return pageIndex;
	}

	private int getValidPageSize() {

		PageableController controller = getController();
		int currentPageSize = controller.getPageSize();
		int pageSize = currentPageSize;
		try {
			pageSize = Integer.parseInt(pageSizeField.getText());
		} catch (NumberFormatException exception) {}

		if (pageSize < 1) {
			return currentPageSize;
		}

		if (pageSize > maxPageSize) {
			return currentPageSize;
		}

		return pageSize;
	}

	private void refreshEnabled(PageableController controller) {
		resultLabel.setText(getResultsText(controller));

		boolean hasPrevious = controller.hasPreviousPage();
		first.setEnabled(hasPrevious);
		previous.setEnabled(hasPrevious);

		boolean hasNext = controller.hasNextPage();
		next.setEnabled(hasNext);
		last.setEnabled(hasNext);
	}

	private static String getResultsText(PageableController controller) {
		int start = controller.getPageOffset() + 1;
		int end = start + controller.getPageSize() - 1;
		long total = controller.getTotalElements();
		if (end > total) {
			end = (int) total;
		}

		return "Rows  " + start + "..." + end + " of " + total;

	}

	//#end region

}
