package org.treez.core.atom.attribute.modelPath;

/**
 * Represents the way a path is selected with the AttributeAtom ModelPath
 *
 */
public enum ModelPathSelectionType {

	/**
	 * The path can be selected from the available targets by selecting an entry
	 * from a list in a combo box
	 */
	FLAT,

	/**
	 * The path can be selected from the available targets by selecting a node
	 * in an hierarchical tree structure.
	 */
	TREE;

}
